const passportLocalSequelize = require("passport-local-sequelize");
const models = require("../../../database/models");

passportLocalSequelize.attachToUser(models.user, {
    usernameField: 'email',
    usernameLowerCase: true,
    hashfield: 'hash',
    saltField: 'salt',
});

module.exports = {
    user: models.user
}
