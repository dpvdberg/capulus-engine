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
            this.hasMany(models.product, {foreignKey: "category_id"});
        }
    }

    category.init({
        name: DataTypes.STRING,
        priority: DataTypes.INTEGER,
        category_id: DataTypes.INTEGER
    }, {
        sequelize,
        underscored: true,
        timestamps: false,
        modelName: 'category',
    });
    return category;
};
