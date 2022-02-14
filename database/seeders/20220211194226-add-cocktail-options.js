'use strict';

const {findFormhintId} = require("./utils/FormhintUtils");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('options', [
      {
        name: 'dilute-extra',
        formhint_id: await findFormhintId(queryInterface, 'checkbox'),
        required_ingredients: false,
        has_none: false,
        show_default: false,
        priority: 100
      }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("options", {
      name: 'dilute-extra'
    });
  }
};
