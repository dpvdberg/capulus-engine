const express = require("express");
const router = express.Router();

const dataRouter = require('./data/dataRouter');
const authRouter = require('./auth/authRouter');

router.use('/data', dataRouter);
router.use('/auth', authRouter);

module.exports = router;
