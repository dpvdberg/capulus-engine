const {Sequelize, DataTypes} = require("sequelize");
const {sequelize} = require("../connectdb")

const User = sequelize.define('users', {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    email: DataTypes.STRING,
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider_uid: {
        type: DataTypes.STRING(2048),
        allowNull: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type : DataTypes.STRING,
        allowNull: false
    },
    hash: DataTypes.STRING(2048),
    salt: DataTypes.STRING(2048),
});

User.sync().then(() => console.log("synced auth tables"))

module.exports = {
    User
}
