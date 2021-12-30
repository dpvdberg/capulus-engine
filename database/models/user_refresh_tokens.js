const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_refresh_tokens', {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    refresh_token_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'refresh_tokens',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_refresh_tokens',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "refresh_token_id" },
        ]
      },
      {
        name: "refresh_token_id",
        using: "BTREE",
        fields: [
          { name: "refresh_token_id" },
        ]
      },
    ]
  });
};
