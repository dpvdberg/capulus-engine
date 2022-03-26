'use strict';

const {productApplyOptions} = require("./utils/OptionUtils");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'SELECT id FROM products WHERE name LIKE :namelike', {
                replacements: {
                    namelike: 'pickwick%'
                },
                type: queryInterface.sequelize.QueryTypes.SELECT
            }).then(products => {
            for (let product of products) {
                productApplyOptions(queryInterface, product.id,
                    [
                        'splash-of-milk',
                        'tea-size',
                        'add-sugar',
                        'add-honey',
                    ]
                )
            }
        });
    },

    async down(queryInterface, Sequelize) {
        // TODO: difficult...
    }
};
