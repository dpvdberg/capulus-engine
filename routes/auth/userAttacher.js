const passportLocalSequelize = require("passport-local-sequelize");
const {sequelize, models} = require('../../database/connectdb');

passportLocalSequelize.attachToUser(models.users);

module.exports = {
    User: models.users
}
