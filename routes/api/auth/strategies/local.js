const passport = require("passport");
const {user} = require("../userAttacher");
const express = require("express");
const router = express.Router();
const {filterUser} = require("../authenticate");
const models = require("../../../../database/models");

passport.use('local', user.createStrategy());

router.post("/login", passport.authenticate("local", {
    failureFlash: 'incorrect-email-or-password',
    failureRedirect: "/api/auth/unauthorized"
}), (req, res, next) => {
    user.findByPk(req.user.id, {
        include: {
            model: models.role,
            attributes: ['name'],
            through: {attributes: []}
        }
    }).then(user => {
            filterUser(user, res);
        }
    )
})

router.post("/register", (req, res, next) => {
    // Verify that first name is not empty
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
    if (!req.body.email) {
        res.status(400).json({
            name: "EmailError",
            message: "The email is required",
        })
        return;
    }
    if (!req.body.password) {
        res.status(400).json({
            name: "PasswordError",
            message: "Password is required",
        })
        return;
    }

    user.register(
        user.build({
            provider: 'local',
            email: req.body.email.toLowerCase(),
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }),
        req.body.password,
        (err, u) => {
            if (err) {
                return res.status(400).send({message: err.message});
            }

            u.roles = []
            req.login(u, function(err) {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                filterUser(u, res);
            });
        }
    );
})

module.exports = router;
