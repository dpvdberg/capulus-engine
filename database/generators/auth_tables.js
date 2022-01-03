const {Sequelize} = require("sequelize");
const DataTypes = require("sequelize").DataTypes;

const {sequelize} = require("../connectdb")

const refreshTokens = sequelize.define('refresh_tokens', {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    refresh_token: DataTypes.STRING(2048)
})

const User = sequelize.define('users', {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    email: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    hash: DataTypes.STRING(2048),
    salt: DataTypes.STRING(2048),
});

refreshTokens.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
})

User.sync().then(() =>
    refreshTokens.sync().then(() =>
        console.log("Synced auth tables.")
    )
)

module.exports = {
    User
}
