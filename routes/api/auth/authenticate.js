const _ = require("lodash");
const {defaultUserFields} = require("./defaultUserFields");

function filterUser(user, res = null) {
    user.roles = user.roles.map(r => r.name)
    let filteredUser = _.pick(user, defaultUserFields);
    if (res !== null) {
        return res.json({user: filteredUser})
    }
    return filteredUser
}

const isAuthenticated = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        return res.status(401).send('User not authenticated')
    }
}

module.exports = {
    filterUser,
    isAuthenticated
}
