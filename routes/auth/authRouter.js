const express = require("express");
const router = express.Router();
// generate required auth tables
require('../../database/generators/auth_tables')

const passport = require("passport")

require('./strategies/local')
require('./strategies/jwt')

const {getToken, COOKIE_OPTIONS, getRefreshToken} = require("./authenticate")
const {User} = require("./userAttacher");
const {sequelize, models} = require('../../database/connectmodels');
const jwt = require("jsonwebtoken");

const _ = require('lodash');
const {defaultUserFields} = require("./defaultUserFields");

async function addRefreshToken(user) {
    const refreshTokenString = getRefreshToken({id: user.id})
    const refresh_token = models.refresh_tokens.build({
        refresh_token: refreshTokenString,
        user_id: user.id
    });
    return refresh_token.save()
}

router.post("/register", (req, res, next) => {
    // Verify that first name is not empty
    if (!req.body.firstname) {
        res.statusCode = 500
        res.send({
            name: "FirstNameError",
            message: "The first name is required",
        })
        return;
    }
    if (!req.body.lastname) {
        res.statusCode = 500
        res.send({
            name: "LastNameError",
            message: "The last name is required",
        })
        return;
    }
    if (!req.body.email) {
        res.statusCode = 500
        res.send({
            name: "EmailError",
            message: "The email is required",
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
        User.build({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            user.save().then((user) => {
                addRefreshToken(user).then((refreshToken) => {
                        const token = getToken({id: user.id})
                        res.cookie("refreshToken", refreshToken.refresh_token, COOKIE_OPTIONS)
                        let filteredUser = _.pick(user, defaultUserFields);
                        res.send({token, user: filteredUser})
                    }
                )
            })
        }
    );
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: '/unauthorized',
    failureFlash: true,
}), (req, res, next) => {
    User.findByPk(req.user.id).then(
        user => {
            addRefreshToken(user).then((refreshToken) => {
                    const token = getToken({id: user.id})
                    res.cookie("refreshToken", refreshToken.refresh_token, COOKIE_OPTIONS)
                    let filteredUser = _.pick(req.user, defaultUserFields);
                    res.send({token, user: filteredUser})
                }
            )
        }
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
                            model: models.users,
                            where: {id: user.id},
                            attributes: []
                        },
                        where: {refresh_token: refreshToken}
                    }))
                .then(token => {
                    if (token != null) {
                        const newRefreshToken = getRefreshToken({id: user_id});
                        return token.update({
                            refresh_token: newRefreshToken
                        }).then(
                            () => token,
                            () => throw new Error("Could not update refresh token")
                        )
                    } else {
                        throw new Error("Token or user not found.");
                    }
                })
                .then(token => {
                    const t = getToken({id: user_id});
                    res.cookie("refreshToken", token.refresh_token, COOKIE_OPTIONS);
                    res.send({t});
                }, (reason) => {
                    res.status(401).send(reason.message);
                })
        } catch (err) {
            res.status(401).send("Unauthorized");
        }
    } else {
        res.status(401).send("Unauthorized");
    }
})

router.get("/me",
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        res.json(req.user)
    })

router.post("/logout",
    passport.authenticate('jwt', {
        failureRedirect: '/unauthorized',
        failureFlash: true,
        session: false
    }),
    (req, res, next) => {
        const {signedCookies = {}} = req
        const {refreshToken} = signedCookies

        if (refreshToken) {
            try {
                const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
                const uid = payload.id
                if (uid !== req.user.id) {
                    res.status(401).send("Token mismatch")
                    return;
                }

                User.findByPk(req.user.id)
                    .then(async (user) => {
                        let token_item = await models.refresh_tokens.findOne({
                            include: {
                                model: models.users,
                                where: {id: user.id},
                                attributes: []
                            },
                            where: {refresh_token: refreshToken}
                        });
                        token_item.destroy()
                    })
                    .then(() => {
                        res.clearCookie("refreshToken", COOKIE_OPTIONS)
                        res.json({success: true})
                    }, () => {
                        res.status(401).send("Could not find or remove token");
                    })
            } catch (err) {
                res.status(401).send("Unauthorized");
            }
        } else {
            res.status(401).send("Unauthorized");
        }
    })

module.exports = router;
