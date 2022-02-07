'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_option extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.option, {foreignKey: "option_id"})
            this.belongsTo(models.product, {foreignKey: "product_id"})
        }
    }

    product_option.init({
        option_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: false,
        modelName: 'product_option',
    });
    return product_option;
};
