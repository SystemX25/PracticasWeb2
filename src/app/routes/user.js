const express = require('express');
const router = express.Router();
const db = require('../api/db.js');

//Obtener todos los productos
// Ruta GET para buscar productos (con o sin filtro por nombre)
router.get('/', (req, res) => {
  const { nombre, password } = req.query;
    console.log('Nombre:', nombre);
    console.log("password", password)
  let sql = 'SELECT * FROM usuarios';
  let params = [];

  if (!nombre || !password) {
    return res.status(500).json({ error: 'Error del servidor' });
    }

    sql += ' WHERE nombre = ? AND password = ?';
    params.push(nombre);  
    params.push(password);
    //console.log(sql);
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error al buscar productos:', err);
      return res.status(500).json({ error: 'Faltan datos' });
    }
    if (results.length > 0) {
      res.json({ success: true, usuario: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  });
});

module.exports = router;