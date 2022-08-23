'use strict';

const fs = require("fs");
module.exports = {
    async up(queryInterface, Sequelize) {
        console.log(`Migrating categories to allow multi-category products`);
        await queryInterface.sequelize.query(
            'SELECT id, category_id FROM products', {
                type: queryInterface.sequelize.QueryTypes.SELECT
            }).then(async (products) => {
                let product_categories = [];
                for (let product of products) {
                    console.log(`Migrating product id '${product.id}' with category id '${product.category_id}'`)
                    product_categories.push(
                        {
                            product_id: product.id,
                            category_id: product.category_id
                        }
                    );

                }

                if (products.length > 0) {
                    await queryInterface.bulkInsert('product_categories', product_categories);
                }
        });

        console.log(`Removing redundant category id column for products`);
        await queryInterface.removeColumn('products', 'category_id');

        console.log(`Creating new category descendant view`);
        await queryInterface.sequelize.query('DROP VIEW category_descendants;')
        let query = fs.readFileSync("database/migrations/raw/20220822/category_descendant.sql", "utf-8");
        await queryInterface.sequelize.query(query);

        console.log(`Creating new product breadcrumb view`);
        await queryInterface.sequelize.query('DROP VIEW product_breadcrumbs;')
        query = fs.readFileSync("database/migrations/raw/20220822/product_breadcrumb.sql", "utf-8");
        await queryInterface.sequelize.query(query);
    },

    async down(queryInterface, Sequelize) {
        // should add values back into product category_id
    }
};
