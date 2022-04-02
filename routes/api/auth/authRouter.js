const express = require("express");
const router = express.Router();
const {filterUser} = require("./authenticate");

const localRouter = require('./strategies/local');
router.use('/local', localRouter);

const googleRouter = require('./strategies/google');
router.use('/google', googleRouter);

const guestRouter = require('./strategies/guest');
router.use('/guest', guestRouter);

router.get('/me', function (req, res) {
        if (req.user) {
            let filteredUser = filterUser(req.user, null);
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
