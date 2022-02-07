'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class option extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsToMany(models.product, {
                through: models.product_option,
                foreignKey: "option_id",
                otherKey: "product_id"
            })
            this.belongsTo(models.formhint, { foreignKey : "formhint_id"})
            this.hasMany(models.option_value, { foreignKey: "option_id"});
            this.hasMany(models.order_product_option, { foreignKey: "option_id"});
            this.hasMany(models.product_option, { foreignKey: "option_id"});
        }
    }

    option.init({
        name: DataTypes.STRING,
        formhint_id: DataTypes.INTEGER,
        required_ingredients: DataTypes.BOOLEAN,
        has_none: DataTypes.BOOLEAN,
        show_default: DataTypes.BOOLEAN,
        priority: DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: false,
        modelName: 'option',
    });
    return option;
};
