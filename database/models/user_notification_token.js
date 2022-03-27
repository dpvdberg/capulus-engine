'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user_notification_token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.user, {foreignKey: "user_id"})
        }
    }

    user_notification_token.init({
        user_id: DataTypes.INTEGER,
        token: DataTypes.STRING(2048)
    }, {
        sequelize,
        modelName: 'user_notification_token',
    });
    return user_notification_token;
};
