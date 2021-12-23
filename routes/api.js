var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'capulus',
    password: 'xdgL5pGgJsf9PZhTdif',
    database: 'capulus',
    namedPlaceholders: true,
    multipleStatements: true
});

function parseOptionData(raw) {
    let optionData = [];

    for (const row of raw) {
        let optionDataIndex = optionData.findIndex(od => od['id'] === row['id']);
        if (optionDataIndex < 0) {
            optionDataIndex = optionData.push({
                'id': row['id'],
                'name': row['name'],
                'formhint': row['formhint_name'],
                'required_ingredients': row['required_ingredients'],
                'value': []
            }) - 1;
        }
        if (row['option_value_id'] !== null) {
            let optionDataValueIndex = optionData[optionDataIndex]['value'].push({
                'id': row['option_value_id'],
                'name': row['option_value_name'],
                'default': row['option_value_default'],
                'ingredient': null,
            }) - 1;

            if (row['ingredient_id'] !== null) {
                optionData[optionDataIndex]['value'][optionDataValueIndex]['ingredient'] =
                    {
                        'id': row['ingredient_id'],
                        'name': row['ingredient_name'],
                        'in_stock': row['ingredient_in_stock'],
                    };

                // Option name inherits ingredient name if present.
                optionData[optionDataIndex]['value'][optionDataValueIndex]['name'] = row['ingredient_name'];
            }
        }
    }

    return optionData;
}

router.get('/categories', function (req, res) {
    pool.execute('SELECT id, name FROM categories WHERE category_id IS NULL ORDER BY priority ASC', function (error, results, fields) {
        if (error) throw error;

        res.json(results);
    });
});

router.get('/category/:categoryId', function (req, res) {
    pool.query(`SELECT id, name FROM categories WHERE category_id = :c ORDER BY priority ASC; SELECT id, name FROM products WHERE category_id = :c`,
        {c: req.params['categoryId']},
        function (error, results, fields) {
            if (error) throw error;

            res.json({
                'categories': results[0],
                'products': results[1],
            });
        });
});

router.get('/product/:productId', async (req, res) => {
    const promisePool = pool.promise();

    // fetch base info
    const productInfoPromise = promisePool.execute(`SELECT id, name FROM products WHERE id = :p`, {p: req.params['productId']});

    // Fetch base ingredients
    const ingredientPromise = promisePool.execute(`
        select pi.ingredient_id as id, i.name, i.in_stock from product_ingredients as pi
        inner join ingredients as i
            on i.id = pi.ingredient_id
        where pi.product_id = :p`,
        {p: req.params['productId']});


    // Fetch options and option ingredients
    const optionPromise = promisePool.execute(`
        select o.id, o.name, o.required_ingredients, fh.name as formhint_name, 
        ov.id as option_value_id, ov.default as option_value_default, 
        ov.name as option_value_name, i.id as ingredient_id, i.name as ingredient_name, 
        i.in_stock as ingredient_in_stock
            from options as o
        inner join product_options as po
            on po.option_id = o.id
        left join option_values as ov
            on o.id = ov.option_id
        left join ingredients as i
            on ov.ingredient_id = i.id
        left join formhints as fh
            on o.formhint_id = fh.id
        where po.product_id = :p
        order by o.priority ASC`,
        {p: req.params['productId']});

    Promise.all([productInfoPromise, ingredientPromise, optionPromise]).then((values) => {
        const [[productInfo,], [ingredientInfo,], [optionInfo,]] = values

        // Post-process results
        let result = {
            'info': productInfo[0],
            'ingredients': ingredientInfo,
            'options': parseOptionData(optionInfo)
        }

        res.json(result);
    });
});

module.exports = router;
