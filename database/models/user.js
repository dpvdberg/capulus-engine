'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsToMany(models.role,
                {
                    through: models.user_role,
                    foreignKey: "user_id",
                    otherKey: "role_id"
                });
            this.hasMany(models.order, {foreignKey: "user_id"});
            this.hasMany(models.user_role, {foreignKey: "user_id"});
        }
    }

    user.init({
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        provider: DataTypes.STRING,
        provider_uid: DataTypes.STRING(2048),
        hash: DataTypes.STRING(2048),
        salt: DataTypes.STRING(2048)
    }, {
        sequelize,
        modelName: 'user',
    });
    return user;
};
