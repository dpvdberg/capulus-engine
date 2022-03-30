'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class news_feed_image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.user, {foreignKey: "post_id"})
        }
    }

    news_feed_image.init({
        uuid: DataTypes.UUID,
        post_id: DataTypes.INTEGER,
        blurhash: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'news_feed_image',
    });
    return news_feed_image;
};
