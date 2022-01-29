const express = require('express');
const router = express.Router();

const dataCategoryRouter = require('./module/category');
router.use('/category', dataCategoryRouter);

const dataProductRouter = require('./module/product');
router.use('/product', dataProductRouter);

const dataOrderRouter = require('./module/order');
router.use('/orders', dataOrderRouter);

const dataBartenderRouter = require('./module/bartender');
router.use('/bartender', dataBartenderRouter);

const dataIngredientRouter = require('./module/ingredient');
router.use('/ingredients', dataIngredientRouter);

const dataStatsRouter = require('./module/stats');
router.use('/stats', dataStatsRouter);

module.exports = router;
