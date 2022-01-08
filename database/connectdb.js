const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.MYSQL_USER, process.env.MYSQL_DB, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    timestamps: false,
});

module.exports = {
    sequelize
}
