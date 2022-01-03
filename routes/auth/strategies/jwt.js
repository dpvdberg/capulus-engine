const passport = require("passport")
const {User} = require("../userAttacher");
const {defaultUserFields} = require("../defaultUserFields");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use('jwt', new JwtStrategy(opts, function (jwt_payload, done) {
    User.findByPk(jwt_payload.id, {
        attributes: defaultUserFields
    }).then(
        (user) => done(null, user),
        (err) => done(err, false)
    )
}));
