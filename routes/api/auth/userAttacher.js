const passportLocalSequelize = require("passport-local-sequelize");
const {models} = require('../../../database/connectmodels');

passportLocalSequelize.attachToUser(models.users, {
    usernameField: 'email',
    usernameLowerCase: true,
    hashfield: 'hash',
    saltField: 'salt',
    incorrectUsernameError : 'incorrect-email-or-password',
    incorrectPasswordError : 'incorrect-email-or-password'
});

module.exports = {
    User: models.users
}
