var DataTypes = require("sequelize").DataTypes;
var _categories = require("./categories");
var _categories_descendants = require("./categories_descendants");
var _formhints = require("./formhints");
var _ingredients = require("./ingredients");
var _option_values = require("./option_values");
var _options = require("./options");
var _product_ingredients = require("./product_ingredients");
var _product_options = require("./product_options");
var _products = require("./products");
var _refresh_tokens = require("./refresh_tokens");
var _user_refresh_tokens = require("./user_refresh_tokens");
var _users = require("./users");

function initModels(sequelize) {
  var categories = _categories(sequelize, DataTypes);
  var categories_descendants = _categories_descendants(sequelize, DataTypes);
  var formhints = _formhints(sequelize, DataTypes);
  var ingredients = _ingredients(sequelize, DataTypes);
  var option_values = _option_values(sequelize, DataTypes);
  var options = _options(sequelize, DataTypes);
  var product_ingredients = _product_ingredients(sequelize, DataTypes);
  var product_options = _product_options(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var refresh_tokens = _refresh_tokens(sequelize, DataTypes);
  var user_refresh_tokens = _user_refresh_tokens(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  ingredients.belongsToMany(products, { as: 'product_id_products', through: product_ingredients, foreignKey: "ingredient_id", otherKey: "product_id" });
  options.belongsToMany(products, { as: 'product_id_products_product_options', through: product_options, foreignKey: "option_id", otherKey: "product_id" });
  products.belongsToMany(ingredients, { as: 'ingredient_id_ingredients', through: product_ingredients, foreignKey: "product_id", otherKey: "ingredient_id" });
  products.belongsToMany(options, { as: 'option_id_options', through: product_options, foreignKey: "product_id", otherKey: "option_id" });
  refresh_tokens.belongsToMany(users, { as: 'user_id_users', through: user_refresh_tokens, foreignKey: "refresh_token_id", otherKey: "user_id" });
  users.belongsToMany(refresh_tokens, { as: 'refresh_token_id_refresh_tokens', through: user_refresh_tokens, foreignKey: "user_id", otherKey: "refresh_token_id" });
  categories.belongsTo(categories, { foreignKey: "category_id"});
  categories.hasMany(categories, { foreignKey: "category_id"});
  products.belongsTo(categories, { foreignKey: "category_id"});
  categories.hasMany(products, { foreignKey: "category_id"});
  options.belongsTo(formhints, { foreignKey: "formhint_id"});
  formhints.hasMany(options, { foreignKey: "formhint_id"});
  option_values.belongsTo(ingredients, { foreignKey: "ingredient_id"});
  ingredients.hasMany(option_values, { foreignKey: "ingredient_id"});
  product_ingredients.belongsTo(ingredients, { foreignKey: "ingredient_id"});
  ingredients.hasMany(product_ingredients, { foreignKey: "ingredient_id"});
  option_values.belongsTo(options, { foreignKey: "option_id"});
  options.hasMany(option_values, { foreignKey: "option_id"});
  product_options.belongsTo(options, { foreignKey: "option_id"});
  options.hasMany(product_options, { foreignKey: "option_id"});
  product_ingredients.belongsTo(products, { foreignKey: "product_id"});
  products.hasMany(product_ingredients, { foreignKey: "product_id"});
  product_options.belongsTo(products, { foreignKey: "product_id"});
  products.hasMany(product_options, { foreignKey: "product_id"});
  user_refresh_tokens.belongsTo(refresh_tokens, { foreignKey: "refresh_token_id"});
  refresh_tokens.hasMany(user_refresh_tokens, { foreignKey: "refresh_token_id"});
  user_refresh_tokens.belongsTo(users, { foreignKey: "user_id"});
  users.hasMany(user_refresh_tokens, { foreignKey: "user_id"});

  return {
    categories,
    categories_descendants,
    formhints,
    ingredients,
    option_values,
    options,
    product_ingredients,
    product_options,
    products,
    refresh_tokens,
    user_refresh_tokens,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
