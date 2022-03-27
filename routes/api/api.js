const express = require("express");
const router = express.Router();

const dataRouter = require('./data/dataRouter');
const authRouter = require('./auth/authRouter');
const notificationRouter = require('./notification/notificationRouter');

router.use('/data', dataRouter);
router.use('/auth', authRouter);
router.use('/notification', notificationRouter);

module.exports = router;
