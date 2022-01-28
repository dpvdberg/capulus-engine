const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {models} = require("../../../../database/connectmodels");
const express = require("express");
const router = express.Router();

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scope: ['profile', 'email'],
        callbackURL: process.env.APP_URL
    },
    function (accessToken, refreshToken, profile, cb) {
        const issuer = 'google'
        models.users.findOne(
            {
                where: {
                    provider: issuer,
                    provider_uid: profile.id
                }
            }
        ).then((db_user) => {
            if (db_user == null) {
                // This must be a new user, create account
                models.users.build({
                    provider: issuer,
                    provider_uid: profile.id,
                    email: profile.emails[0].value,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName
                }).save().then(
                    (new_dbuser) => {
                        return cb(null, new_dbuser);
                    },
                    (err) => {
                        return cb(err, false);
                    }
                )
            } else {
                // Existing user, return account info
                return cb(null, db_user)
            }
        });
    }
));

router.get("/login", passport.authenticate("google"))

router.get("/callback", passport.authenticate("google", {failureRedirect: '/unauthorized'}),
    (req, res, next) => {
        res.redirect('/')
    }
)

module.exports = router;
