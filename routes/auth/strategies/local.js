const passportLocalSequelize = require("passport-local-sequelize");
const passport = require("passport");
const {User} = require("../userAttacher");

// Called during login/sign up.
passport.use('local', User.createStrategy());

// called while after logging in / signing up to set user details in req.user
passport.serializeUser(User.serializeUser());
