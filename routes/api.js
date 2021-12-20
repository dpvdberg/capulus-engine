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

router.get('/categories', function (req, res) {
    pool.execute('SELECT id, name FROM categories WHERE category_id IS NULL ORDER BY priority DESC', function (error, results, fields) {
        if (error) throw error;

        res.send(results);
    });
});

router.get('/category/:categoryId', function (req, res) {
    pool.query(`SELECT id, name FROM categories WHERE category_id = :c ORDER BY priority DESC; SELECT id, name FROM products WHERE category_id = :c`,
        {c: req.params['categoryId']},
        function (error, results, fields) {
            if (error) throw error;

            res.send({
                'categories': results[0],
                'products': results[1],
            });
        });
});

router.get('/product/:productId', function (req, res) {
    pool.query(`SELECT id, name FROM products WHERE id = :p`,
        {p: req.params['productId']},
        function (error, results, fields) {
            if (error) throw error;

            res.send(results);
        });
});

module.exports = router;
