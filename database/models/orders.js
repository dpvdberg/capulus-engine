const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    fulfilled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    cancelled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    cancel_reason: {
      type: DataTypes.STRING(2048),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orders',
    timestamps: true,
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
        name: "fk_orders_user_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
