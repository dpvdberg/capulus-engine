'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category_descendant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  category_descendant.init({
    name: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    descendant_count: DataTypes.INTEGER,
    hide_if_unavailable : DataTypes.BOOLEAN,
    in_stock: DataTypes.BOOLEAN
  }, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'category_descendant',
  });
  return category_descendant;
};
