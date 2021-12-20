var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'capulus',
    password: 'xdgL5pGgJsf9PZhTdif',
    database: 'capulus'
});

router.get('/categories', function(req, res) {
    pool.execute('SELECT id, name FROM categories', function (error, results, fields) {
        if (error) throw error;

        res.send(results);
    });
});

module.exports = router;
