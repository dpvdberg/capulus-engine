const passport = require("passport");
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

router.post("/setup", (req, res, next) => {
    if (!req.body.first_name) {
        res.status(400).send("The first name is required")
        return;
    }

    if (!req.body.last_name) {
        res.status(400).send("The last name is required")
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
                    return res.status(400).send(err.message);
                }
                res.json({
                    token: guest_token
                })
            });
        },
        (err) => {
            res.status(500).send("Could not create user")
        }
    );
})

module.exports = router;
