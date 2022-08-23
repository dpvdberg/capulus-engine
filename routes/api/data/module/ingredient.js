const models = require("../../../../database/models");
const express = require("express");
const {isAuthenticated} = require("../../auth/authenticate");
const rbac = require("../../../../permissions/rbac");
const {sendIngredientBroadcast} = require("../../../ws/ws");
const router = express.Router();


router.get('/list', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    rbac.can(roles, 'ingredients:list')
        .then(result => {
            if (!result) {
                return res.status(401).send( 'User not authorized')
            }

            models.ingredient.findAll()
                .then((ingredients) => {
                    res.json(ingredients);
                })
        })
})

router.post('/modify', isAuthenticated, (req, res) => {
    const roles = req.user.roles.map(r => r.name);

    try {
        const data = req.body
        rbac.can(roles, 'ingredients:modify')
            .then(result => {
                if (!result) {
                    return res.status(401).json({
                        error: 'User not authorized'
                    })
                }

                // Do two updates, one settings all that got disabled
                // and one update for all ingredients that got enabled

                const enabled_ids = data
                    .filter(c => c.stock === true)
                    .map(c => Number(c.id));

                const disabled_ids = data
                    .filter(c => c.stock === false)
                    .map(c => Number(c.id));

                const enable_promise = models.ingredient.update(
                    {in_stock: true},
                    {
                        where: {id: enabled_ids}
                    }
                );

                const disable_promise = models.ingredient.update(
                    {in_stock: false},
                    {
                        where: {id: disabled_ids}
                    }
                );

                Promise.all([enable_promise, disable_promise])
                    .then(() => {
                        res.sendStatus(200).end();
                        sendIngredientBroadcast();
                    })
                    .catch(err => {
                        console.log("error updating ingredients")
                        console.log(err);
                    });
            })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: 'Error while processing request'
        })
    }
})

module.exports = router;
