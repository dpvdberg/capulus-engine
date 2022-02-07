'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class formhint extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.option, {foreignKey: "formhint_id"})
        }
    }

    formhint.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        timestamps: false,
        modelName: 'formhint',
    });
    return formhint;
};
