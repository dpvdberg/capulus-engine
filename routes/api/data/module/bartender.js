const express = require('express');
const router = express.Router();

const btOrderRouter = require('./bartender/order');
router.use('/orders', btOrderRouter);

module.exports = router;
