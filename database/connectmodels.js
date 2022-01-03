const initModels = require("./models/init-models");
const {sequelize} = require("./connectdb");
const models = initModels(sequelize);

module.exports = {
    models
}
