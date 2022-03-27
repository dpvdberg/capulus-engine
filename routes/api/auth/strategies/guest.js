const passport = require("passport");
const {filterUser} = require("../authenticate");
const models = require("../../../../database/models");
const {UniqueTokenStrategy} = require('passport-unique-token');
const express = require("express");
const router = express.Router();
const {v4: uuid} = require("uuid");

passport.use('guest',
    new UniqueTokenStrategy((token, done) => {
        models.user.findOne(
            {
                where: {
                    provider: 'guest',
                    provider_uid: token
                }
            }).then((user) => {

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        },)
    }),
);

router.get("/verify", passport.authenticate('guest'),
    (req, res, next) => {
        res.sendStatus(200);
    }
)

router.post("/setup", (req, res, next) => {
    if (!req.body.first_name) {
        res.status(400).json({
            name: "FirstNameError",
            message: "The first name is required",
        })
        return;
    }

    if (!req.body.last_name) {
        res.status(400).json({
            name: "LastNameError",
            message: "The last name is required",
        })
        return;
    }

    let guest_token = uuid();
    models.user.create({
        provider: 'guest',
        provider_uid: guest_token,
        email: "",
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }).then(
        (new_dbuser) => {
            new_dbuser.roles = []
            req.login(new_dbuser, function (err) {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                res.json({
                    token: guest_token
                })
            });
        },
        (err) => {
            res.status(500).json({
                name: "TokenError",
                message: "Token is required",
            })
        }
    );
})

module.exports = router;
