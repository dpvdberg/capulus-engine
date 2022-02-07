'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order_product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.order_product_option, {as: 'option_values', foreignKey: "order_product_id"})
            this.belongsTo(models.order, {foreignKey: "order_id"})
            this.belongsTo(models.product, {foreignKey: "product_id"})
        }
    }

    order_product.init({
        order_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: false,
        modelName: 'order_product',
    });
    return order_product;
};
