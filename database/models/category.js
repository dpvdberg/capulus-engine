'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(this, {foreignKey: "category_id"});
            this.hasMany(this, {foreignKey: "category_id"});
            this.belongsToMany(models.product, {
                through: models.product_category,
                foreignKey: "category_id",
                otherKey: "product_id"
            });
        }
    }

    category.init({
        name: DataTypes.STRING,
        priority: DataTypes.INTEGER,
        category_id: DataTypes.INTEGER,
        hide_if_unavailable: DataTypes.BOOLEAN
    }, {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'category',
    });
    return category;
};
