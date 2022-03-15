'use strict';

const fs = require('fs');

module.exports = {
    async up(queryInterface, Sequelize) {
        let tea_id = await queryInterface.rawSelect('categories', {
            where: {name: 'tea'},
        }, ['id']);

        if (!tea_id) {
            console.error(`Tea category not found`)
            return;
        }

        const pickwickCatId = await queryInterface.bulkInsert('categories', [
            {
                name: 'pickwick.base',
                priority: 1,
                hide_if_unavailable: true,
                category_id: tea_id
            },
        ]);

        const rawdata = fs.readFileSync("database/seeders/data/pickwick-data.json", "utf-8");
        let data = JSON.parse(rawdata);

        for (const category of data) {
            let subcategoryId = await queryInterface.bulkInsert('categories', [{
                name: category['iname'],
                priority: 0,
                hide_if_unavailable: true,
                category_id: pickwickCatId
            }]);
            for (const product of category['products']) {
                let product_id = await queryInterface.bulkInsert('products',
                    [{
                        name: product['full-iname'],
                        priority: 0,
                        image_fit: 'contain',
                        hide_if_unavailable: true,
                        category_id: subcategoryId,
                    }]
                )

                let ingredient_id = await queryInterface.bulkInsert('ingredients',
                    [{
                        name: product['full-iname'],
                        in_stock: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }]
                )

                await queryInterface.bulkInsert('product_ingredients',
                    [{
                        product_id: product_id,
                        ingredient_id: ingredient_id,
                        required: true,
                    }]
                )
            }
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("categories", {name: 'pickwick.base'});
    }
};
