const {models} = require("../../../../database/connectmodels");
const express = require("express");
const {getFullProductOptions, propagateOptionName} = require("../utils");
const router = express.Router();

router.get('/:productId', (req, res) => {
    let productId = req.params['productId'];

    // fetch base info
    models.products.findByPk(productId,
        getFullProductOptions()
    ).then((data) => {
        // Propagate name of option
        data.options = propagateOptionName(data.options);
        res.json(data);
    });
});

module.exports = router;
