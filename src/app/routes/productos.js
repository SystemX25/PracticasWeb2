const express = require('express');
const router = express.Router();
const db = require('../api/db.js');

//Obtener todos los productos
router.get('/', (req, res) => {
    db.query('SELECT * FROM productos', (err, rows) => {
        if(err) throw err;
        res.json(rows);
    });
});

module.exports = router;