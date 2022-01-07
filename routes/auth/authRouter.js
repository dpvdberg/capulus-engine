const express = require("express");
const router = express.Router();
// generate required auth tables
require('../../database/generators/auth_tables')

require('./strategies/google')

const localRouter = require('./strategies/local');
router.use('/local', localRouter);

const googleRouter = require('./strategies/google');
const {defaultUserFields} = require("./defaultUserFields");
const _ = require("lodash");
router.use('/google', googleRouter);

router.post('/logout', function (req, res) {
    req.logout();
    res.json({success: true});
});

router.get('/unauthorized', function (req, res) {
    res.status(401);
    res.json(req.flash());
});

router.get('/me', function (req, res) {
        if (req.user) {
            let filteredUser = _.pick(req.user, defaultUserFields);
            res.json({logged_in: true, user: filteredUser})
        } else {
            res.json({logged_in: false})
        }
    }
)

router.post('/logout',
    function (req, res) {
        req.logout();
        res.json({success: true});
    });

module.exports = router;
