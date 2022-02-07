'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order_product_option extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.option_value, {foreignKey: "option_value_id"})
            this.belongsTo(models.option, {foreignKey: "option_id"})
            this.belongsTo(models.order_product, {foreignKey: "order_product_id"})
        }
    }

    order_product_option.init({
        order_product_id: DataTypes.INTEGER,
        option_id: DataTypes.INTEGER,
        option_value_id: DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'order_product_option',
    });
    return order_product_option;
};
