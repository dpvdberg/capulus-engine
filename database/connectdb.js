const initModels = require("./models/init-models");
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize('capulus', 'capulus', 'xdgL5pGgJsf9PZhTdif', {
    dialect: 'mysql',
    timestamps: false,
});
const models = initModels(sequelize);

module.exports = {
    sequelize,
    models
}
