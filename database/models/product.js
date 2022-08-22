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
            this.belongsToMany(models.category, {
                through: models.product_category,
                foreignKey: "product_id",
                otherKey: "category_id"
            })

            this.hasMany(models.order_product, {foreignKey: "product_id"});
            this.hasMany(models.product_ingredient, {foreignKey: "product_id"});
            this.hasMany(models.product_option, {foreignKey: "product_id"});
            this.hasMany(models.product_breadcrumb, {foreignKey: "product_id"});
        }
    }

    product.init({
        name: DataTypes.STRING,
        priority: DataTypes.INTEGER,
        hide_if_unavailable: DataTypes.BOOLEAN,
        breadcrumb_depth: DataTypes.INTEGER,
        image_fit: DataTypes.STRING
    }, {
        sequelize,
        timestamps: false,
        underscored: true,
        modelName: 'product',
    });
    return product;
};
