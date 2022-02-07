const passportLocalSequelize = require("passport-local-sequelize");
const models = require("../../../database/models");

passportLocalSequelize.attachToUser(models.user, {
    usernameField: 'email',
    usernameLowerCase: true,
    hashfield: 'hash',
    saltField: 'salt',
    incorrectUsernameError : 'incorrect-email-or-password',
    incorrectPasswordError : 'incorrect-email-or-password'
});

module.exports = {
    user: models.user
}
