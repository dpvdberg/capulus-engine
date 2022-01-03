const passportLocalSequelize = require("passport-local-sequelize");
const {sequelize, models} = require('../../database/connectmodels');
const {defaultUserFields} = require("./defaultUserFields");

passportLocalSequelize.attachToUser(models.users, {
    usernameField: 'email',
    hashfield: 'hash',
    saltField: 'salt',
    incorrectUsernameError : 'incorrect-email-or-password',
    incorrectPasswordError : 'incorrect-email-or-password'
});

module.exports = {
    User: models.users
}
