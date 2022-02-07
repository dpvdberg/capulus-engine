'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.order_product, {as: 'product_orders', foreignKey: "order_id"})
            this.belongsTo(models.user, {foreignKey: "user_id"})
        }
    }

    order.init({
        user_id: DataTypes.INTEGER,
        fulfilled: DataTypes.BOOLEAN,
        cancelled: DataTypes.BOOLEAN,
        cancel_reason: DataTypes.STRING(2048)
    }, {
        sequelize,
        modelName: 'order',
    });
    return order;
};
