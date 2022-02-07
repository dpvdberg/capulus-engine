'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_ingredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.ingredient, {foreignKey: "ingredient_id"})
            this.belongsTo(models.product, {foreignKey: "product_id"})
        }
    }

    product_ingredient.init({
        product_id: DataTypes.INTEGER,
        ingredient_id: DataTypes.INTEGER,
        required: DataTypes.BOOLEAN
    }, {
        sequelize,
        timestamps: false,
        modelName: 'product_ingredient',
    });
    return product_ingredient;
};
