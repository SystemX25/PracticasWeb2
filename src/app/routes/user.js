const express = require('express');
const router = express.Router();
const db = require('../api/db.js');

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

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
   if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  db.query('SELECT * FROM usuarios WHERE correo = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    
    if (results.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const insertSql = 'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)';
    db.query(insertSql, [name, email, password], (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      
      res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header('Access-Control-Allow-Methods', 'POST');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      res.json({ 
        success: true, 
        message: 'Registro exitoso',
        userId: result.insertId 
      });
    });
  });
});

module.exports = router;