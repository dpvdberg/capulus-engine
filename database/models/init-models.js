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
  var users = _users(sequelize, DataTypes);

  ingredients.belongsToMany(products, { through: product_ingredients, foreignKey: "ingredient_id", otherKey: "product_id" });
  options.belongsToMany(products, { through: product_options, foreignKey: "option_id", otherKey: "product_id" });
  products.belongsToMany(ingredients, { through: product_ingredients, foreignKey: "product_id", otherKey: "ingredient_id" });
  products.belongsToMany(options, { through: product_options, foreignKey: "product_id", otherKey: "option_id" });
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
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
