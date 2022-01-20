const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('options', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    formhint_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'formhints',
        key: 'id'
      }
    },
    required_ingredients: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    has_none: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    show_default: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'options',
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
        name: "fk_formhint_idx",
        using: "BTREE",
        fields: [
          { name: "formhint_id" },
        ]
      },
    ]
  });
};
