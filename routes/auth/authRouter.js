const express = require("express");
const router = express.Router();

// generate required auth tables
require('../../database/generators/auth_tables')

const passport = require("passport")

require('./strategies/local')
require('./strategies/jwt')

const {getToken, COOKIE_OPTIONS, getRefreshToken} = require("./authenticate")
const {User} = require("./userAttacher");
const {sequelize, models} = require('../../database/connectdb');
const jwt = require("jsonwebtoken");

async function addRefreshToken(user) {
    const refreshTokenString = getRefreshToken({id: user.id})
    const refresh_token = models.refresh_tokens.build({
        refresh_token: refreshTokenString
    });
    return refresh_token.save()
        .then(() =>
            models.user_refresh_tokens.build({
                user_id: user.id,
                refresh_token_id: refresh_token.id
            }).save()
        ).then(() =>
            refresh_token
        )
}

router.post("/register", (req, res, next) => {
    // Verify that first name is not empty
    if (!req.body.username) {
        res.statusCode = 500
        res.send({
            name: "FirstNameError",
            message: "The first name is required",
        })
        return;
    }
    if (!req.body.password) {
        res.statusCode = 500
        res.send({
            name: "PasswordError",
            message: "Password is required",
        })
        return;
    }

    User.register(
        req.body.username,
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500
                res.send(err)
                return;
            }

            user.save().then((user) => {
                addRefreshToken(user).then((refreshToken) => {
                        const token = getToken({id: user.id})
                        res.cookie("refreshToken", refreshToken.refresh_token, COOKIE_OPTIONS)
                        res.send({success: true, token})
                    }
                )
            })
        }
    );
})

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    User.findByPk(req.user.id).then(
        user => {
            addRefreshToken(user).then((refreshToken) => {
                    const token = getToken({id: user.id})
                    res.cookie("refreshToken", refreshToken.refresh_token, COOKIE_OPTIONS)
                    res.send({success: true, token})
                }
            )
        },
        err => next(err)
    )
})

router.post("/refreshToken", (req, res, next) => {
    const {signedCookies = {}} = req
    const {refreshToken} = signedCookies

    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const user_id = payload.id
            User.findByPk(user_id)
                .then(user =>
                        models.refresh_tokens.findOne({
                            include: {
                                model: models.user_refresh_tokens,
                                where: {user_id: user.id}
                            },
                            where: {refresh_token: refreshToken}
                        }),
                    () => {
                        res.statusCode = 401
                        res.send("Unauthorized")
                    })
                .then(token => {
                    if (token != null) {
                        const newRefreshToken = getRefreshToken({id: user_id});
                        return token.update({
                            refresh_token: newRefreshToken
                        }).then(
                            () => token,
                            () => Promise.reject("Could not update refresh token")
                        )
                    } else {
                        return Promise.reject("Token or user not found.");
                    }
                })
                .then(token => {
                    const t = getToken({id: user_id});
                    res.cookie("refreshToken", token.refresh_token, COOKIE_OPTIONS);
                    res.send({success: true, t})
                }, (reason) => {
                    res.statusCode = 401
                    res.send(reason)
                })
        } catch (err) {
            res.statusCode = 401
            res.send("Unauthorized")
        }
    } else {
        res.statusCode = 401
        res.send("Unauthorized")
    }
})

router.get("/me",
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        res.json(req.user)
    })

router.get("/logout",
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        const {signedCookies = {}} = req
        const {refreshToken} = signedCookies

        if (refreshToken) {
            try {
                const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
                const user_id = payload.id
                if (user_id !== req.user.id) {
                    res.statusCode = 401
                    res.send("Unauthorized")
                    return;
                }
                User.findByPk(req.user.id)
                    .then(user =>
                            models.refresh_tokens.findOne({
                                include: {
                                    model: models.user_refresh_tokens,
                                    where: {user_id: user.id}
                                },
                                where: {refresh_token: refreshToken}
                            }),
                        () => {
                            res.statusCode = 401
                            res.send("Unauthorized")
                        })
                    .then(token => token.destroy(),
                        () => {
                            res.statusCode = 401
                            res.send("Token or user not found.");
                        })
                    .then(() => {
                            res.clearCookie("refreshToken", COOKIE_OPTIONS)
                            res.send({success: true})
                        },
                        () => {
                            res.statusCode = 500
                            res.send("Could not clear token.");
                        })
            } catch (err) {
                res.statusCode = 401
                res.send("Unauthorized")
            }
        } else {
            res.statusCode = 401
            res.send("Unauthorized")
        }
    })

module.exports = router;
