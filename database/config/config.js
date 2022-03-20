require('dotenv').config({path: '../.env'});

module.exports = {
  "development": {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    dialectOptions: {
      decimalNumbers: true,
      dateStrings: true,
      typeCast: true,
      timezone: "local",
    },
    timezone: process.env.TIMEZONE,
    timestamps: false,
    logging: console.log
  },
  "production": {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    dialectOptions: {
      decimalNumbers: true,
      dateStrings: true,
      typeCast: true,
      timezone: "local",
    },


    timezone: process.env.TIMEZONE,
    timestamps: false,
    logging: false
  },
}
