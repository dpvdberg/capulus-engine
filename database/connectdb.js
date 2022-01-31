const {Sequelize} = require("sequelize");
console.log("Using db user: " + process.env.MYSQL_USER)
console.log(process.env.NODE_ENV)
const sequelize = new Sequelize(process.env.MYSQL_USER, process.env.MYSQL_DB, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
        decimalNumbers: true,
        dateStrings: true,
        typeCast: true,
        timezone: "local",
    },
    timezone: process.env.TIMEZONE,
    timestamps: false,
    logging: process.env.NODE_ENV === "production" ? false : console.log
});

module.exports = {
    sequelize
}
