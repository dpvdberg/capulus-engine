const {Sequelize} = require("sequelize");
const sequelize = new Sequelize('capulus', 'capulus', 'xdgL5pGgJsf9PZhTdif', {
    dialect: 'mysql',
    timestamps: false,
});

module.exports = {
    sequelize
}
