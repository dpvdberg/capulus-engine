const {sequelize} = require("../../database/connectdb");
const DataTypes = require("sequelize").DataTypes;

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
    username: DataTypes.STRING,
    hash: DataTypes.STRING(2048),
    salt: DataTypes.STRING(2048),
});

const userRefreshTokens = sequelize.define('user_refresh_tokens', {
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: 'users',
            key: 'id'
        },
        primaryKey: true
    },
    refresh_token_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: 'refresh_tokens',
            key: 'id'
        },
        primaryKey: true
    }
})

refreshTokens.hasMany(userRefreshTokens, {onDelete: 'cascade'})

refreshTokens.sync().then(() =>
    User.sync().then(() =>
        userRefreshTokens.sync().then(() =>
            console.log("Synced auth tables.")
        )
    )
);


module.exports = {
    User
}
