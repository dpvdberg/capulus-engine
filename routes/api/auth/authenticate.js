const _ = require("lodash");
const {defaultUserFields} = require("./defaultUserFields");

function userResponse(user, res) {
    let filteredUser = _.pick(user, defaultUserFields);
    res.json({user: filteredUser})
}

const isAuthenticated = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({
            error: 'User not authenticated'
        })
    }
}

module.exports = {
    userResponse,
    isAuthenticated
}
