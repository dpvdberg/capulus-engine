'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class option_value extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.ingredient, {foreignKey: "ingredient_id"})
            this.hasMany(models.order_product_option, {foreignKey: "option_value_id"})
            this.belongsTo(models.option, {foreignKey: "option_id", onDelete: "cascade"})
        }
    }

    option_value.init({
        name: DataTypes.STRING,
        option_id: DataTypes.INTEGER,
        ingredient_id: DataTypes.INTEGER,
        default: DataTypes.BOOLEAN
    }, {
        sequelize,
        timestamps: false,
        modelName: 'option_value',
    });
    return option_value;
};
