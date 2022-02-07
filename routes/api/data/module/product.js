const models = require("../../../../database/models");
const express = require("express");
const {getFullProductOptions, propagateOptionName} = require("../utils");
const router = express.Router();

router.get('/:productId', (req, res) => {
    let productId = req.params['productId'];

    // fetch base info
    models.product.findByPk(productId,
        getFullProductOptions()
    ).then((data) => {
        if (!data) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }
        // Propagate name of option
        data.options = propagateOptionName(data.options);
        res.json(data);
    });
});

module.exports = router;
