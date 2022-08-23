'use strict';

const fs = require("fs");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('DROP VIEW category_descendants;')
        let query = fs.readFileSync("database/migrations/raw/20220823/category_descendant.sql", "utf-8");
        await queryInterface.sequelize.query(query);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('DROP VIEW category_descendants;')
        let query = fs.readFileSync("database/migrations/raw/20220822/category_descendant.sql", "utf-8");
        await queryInterface.sequelize.query(query);
    }
};
