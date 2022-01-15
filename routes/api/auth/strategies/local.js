const passport = require("passport");
const {User} = require("../userAttacher");
const express = require("express");
const router = express.Router();
const {userResponse} = require("../authenticate");
const {models} = require("../../../../database/connectmodels");

passport.use('local', User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(function (username, cb) {
    username = username.toLowerCase();

    const queryParameters = {};
    queryParameters['email'] = username;

    const query = User.findOne({
        where: queryParameters,
        include: {
            model: models.roles,
            attributes: ['name'],
            through: {attributes:[]}
        }
    });
    query.then(function (user) {
        cb(null, user);
    });
    query.catch(function (err) {
        cb(err);
    });
});

router.post("/login", passport.authenticate("local", {
    failureFlash: 'incorrect-email-or-password',
    failureRedirect: "/api/auth/unauthorized"
}), (req, res, next) => {
    User.findByPk(req.user.id).then(user => {
            userResponse(user, res);
        }
    )
})

router.post("/register", (req, res, next) => {
    // Verify that first name is not empty
    if (!req.body.first_name) {
        res.statusCode = 500
        res.send({
            name: "FirstNameError",
            message: "The first name is required",
        })
        return;
    }
    if (!req.body.last_name) {
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
            provider: 'local',
            email: req.body.email.toLowerCase(),
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            user.save().then((user) => {
                userResponse(user, res);
            })
        }
    );
})

module.exports = router;
