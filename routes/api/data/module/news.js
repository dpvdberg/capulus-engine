const models = require("../../../../database/models");
const express = require("express");
const {isAuthenticated} = require("../../auth/authenticate");

const router = express.Router();

router.post('/get', isAuthenticated, (req, res) => {
    if (!req.body.start) {
        res.status(400).send("Missing start index")
        return;
    }
    // TODO: check other arguments, e.g. count

    // TODO: Implement
})

module.exports = router;
