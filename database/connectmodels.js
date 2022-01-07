const initModels = require("./models/init-models");
const {sequelize} = require("./connectdb");
const models = initModels(sequelize);

sequelize.sync();

module.exports = {
    models
}
