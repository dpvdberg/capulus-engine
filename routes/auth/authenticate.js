const _ = require("lodash");
const {defaultUserFields} = require("./defaultUserFields");

function userResponse(user, res) {
    let filteredUser = _.pick(user, defaultUserFields);
    res.json({user: filteredUser})
}

module.exports = {
    userResponse
}
