'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsToMany(models.ingredient, {
                through: models.product_ingredient,
                foreignKey: "product_id",
                otherKey: "ingredient_id"
            })
            this.belongsToMany(models.option, {
                through: models.product_option,
                foreignKey: "product_id",
                otherKey: "option_id"
            })

            this.belongsTo(models.category, {foreignKey: "category_id", onDelete: 'cascade'});
            this.hasMany(models.order_product, {foreignKey: "product_id"});
            this.hasMany(models.product_ingredient, {foreignKey: "product_id"});
            this.hasMany(models.product_option, {foreignKey: "product_id"});
        }
    }

    product.init({
        name: DataTypes.STRING,
        priority: DataTypes.INTEGER,
        category_id: DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'product',
    });
    return product;
};