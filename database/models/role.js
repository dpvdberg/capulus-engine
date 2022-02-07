'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsToMany(models.user,
                {
                    through: models.user_role,
                    foreignKey: "role_id",
                    otherKey: "user_id"
                });
            this.hasMany(models.user_role, { foreignKey: "role_id"});
        }
    }

    role.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        timestamps: false,
        modelName: 'role',
    });
    return role;
};
