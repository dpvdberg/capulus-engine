const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.MYSQL_USER, process.env.MYSQL_DB, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        useUTC : false
    },
    timezone: process.env.TIMEZONE,
    timestamps: false,
});

module.exports = {
    sequelize
}
