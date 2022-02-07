'use strict';
const fs = require('fs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const query = fs.readFileSync("migrations/raw/category_descendant.sql", "utf-8");
    // console.log(query)
    await queryInterface.sequelize.query(query)
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP VIEW category_descendants;')
  }
};
