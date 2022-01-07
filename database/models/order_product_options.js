const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_product_options', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    order_product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'order_products',
        key: 'id'
      }
    },
    option_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'options',
        key: 'id'
      }
    },
    option_value_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'option_values',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'order_product_options',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_order_product_options_option_idx",
        using: "BTREE",
        fields: [
          { name: "option_id" },
        ]
      },
      {
        name: "fk_order_product_options_option_value_idx",
        using: "BTREE",
        fields: [
          { name: "option_value_id" },
        ]
      },
      {
        name: "fk_order_product_options_order_product_idx",
        using: "BTREE",
        fields: [
          { name: "order_product_id" },
        ]
      },
    ]
  });
};
