const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.MYSQL_USER, process.env.MYSQL_DB, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: "local",
    },
    timezone: process.env.TIMEZONE,
    timestamps: false,
});

module.exports = {
    sequelize
}
