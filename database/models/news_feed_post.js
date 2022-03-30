'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class news_feed_post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.user, {foreignKey: "user_id"});
            this.hasMany(models.news_feed_image, {foreignKey: "post_id"});
        }
    }

    news_feed_post.init({
        uuid: DataTypes.UUID,
        title: DataTypes.STRING,
        text: DataTypes.STRING,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'news_feed_post',
    });
    return news_feed_post;
};
