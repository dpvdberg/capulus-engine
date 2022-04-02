const passport = require("passport");
const {user} = require("../userAttacher");
const express = require("express");
const router = express.Router();
const {filterUser} = require("../authenticate");
const models = require("../../../../database/models");

passport.use('local', user.createStrategy());

router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, u, info) {
        if (err) {
            return next(err);
        }
        if (!u) {
            return res.status(401).send('incorrect-email-or-password');
        }

        user.findByPk(u.id, {
            include: {
                model: models.role,
                attributes: ['name'],
                through: {attributes: []}
            }
        }).then(u => {
            req.login(u, function(err) {
                if (err) {
                    return res.status(400).send('Could not login user');
                }
                filterUser(u, res);
            });
        })
    })(req, res, next);
});

router.post("/register", (req, res, next) => {
    // Verify that first name is not empty
    if (!req.body.first_name) {
        res.status(400).send("The first name is required")
        return;
    }
    if (!req.body.last_name) {
        res.status(400).send("The last name is required")
        return;
    }
    if (!req.body.email) {
        res.status(400).send("The email is required")
        return;
    }
    if (!req.body.password) {
        res.status(400).send("Password is required")
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
            req.login(u, function (err) {
                if (err) {
                    return res.status(400).send({message: err.message});
                }
                filterUser(u, res);
            });
        }
    );
})

module.exports = router;
