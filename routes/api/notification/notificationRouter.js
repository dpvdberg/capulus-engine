const express = require('express');
const {isAuthenticated} = require("../auth/authenticate");
const rbac = require("../../../permissions/rbac");
const models = require("../../../database/models");
const router = express.Router();

router.post('/subscribe', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    if (!req.body.token) {
        res.status(400).json("Missing token")
        return;
    }

    rbac.can(roles, 'orders:notifications')
        .then(result => {
            if (!result) {
                return res.status(401).json('User not authorized')
            }

            models.user_notification_token.findOne(
                {
                    where: {
                        user_id: req.user.id,
                        token: req.body.token
                    }
                }
            ).then((u) => {
                if (u == null) {
                    models.user_notification_token.create({
                        user_id: req.user.id,
                        token: req.body.token
                    }).then(() => {
                        res.sendStatus(200).end();
                    }, (err) => {
                        console.error(err)
                        return res.status(400).send('Could not save notification token');
                    });
                } else {
                    // Silently return ok
                    res.sendStatus(200).end();
                }
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send('Authorization error')
        });
})

module.exports = router;
