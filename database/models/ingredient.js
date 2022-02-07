'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ingredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsToMany(
                models.product,
                {
                    through: models.product_ingredient,
                    foreignKey: "ingredient_id",
                    otherKey: "product_id"
                })

            this.hasMany(models.option_value, { foreignKey: "ingredient_id"});
            this.hasMany(models.product_ingredient, { foreignKey: "ingredient_id"});
        }
    }

    ingredient.init({
        name: DataTypes.STRING,
        in_stock: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'ingredient',
    });
    return ingredient;
};
