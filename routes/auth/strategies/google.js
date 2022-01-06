const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {models} = require("../../../database/connectmodels");
const {defaultUserFields} = require("../defaultUserFields");
const _ = require("lodash");

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scope: [ 'profile', 'email' ],
        callbackURL: 'http://192.168.1.3.nip.io:3000/api/auth/login/google/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
        const issuer = 'google'
        models.users.findOne(
            {
                where: {
                    provider: issuer,
                    provider_uid: profile.id
                },
                attributes: defaultUserFields
            }
        ).then((dbuser) => {
            if (dbuser == null) {
                // This must be a new user, create account
                models.users.build({
                    provider: issuer,
                    provider_uid: profile.id,
                    email: profile.emails[0].value,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName
                }).save().then(
                    (new_dbuser) => {
                        let filteredUser = _.pick(new_dbuser, defaultUserFields);
                        return cb(null, filteredUser);
                    },
                    (err) => {
                        return cb(err, false);
                    }
                )
            } else {
                // Existing user, return account info
                return cb(null, dbuser)
            }
        });
    }
));
