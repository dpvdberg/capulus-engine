const initModels = require("./models/init-models");
const {sequelize} = require("./connectdb");
const models = initModels(sequelize);

// Custom aliases
models.order_products.hasMany(models.order_product_options, { as: 'option_values', foreignKey: "order_product_id"});
models.orders.hasMany(models.order_products, { as : 'product_orders', foreignKey: "order_id"});

sequelize.sync();

module.exports = {
    models
}
