const express = require('express');
const router = express.Router();
const db = require('../api/db.js');

// Obtener todos los productos
// Ruta GET para buscar productos (con o sin filtro por nombre)
router.get('/', (req, res) => {
  const { nombre, password } = req.query;
  console.log('Nombre:', nombre);
  console.log("password", password);
  
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
  const { nombre, email, password } = req.body;
  
  if (!nombre || !email || !password) {
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
    db.query(insertSql, [nombre, email, password], (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      
      res.json({ 
        success: true, 
        message: 'Registro exitoso',
        userId: result.insertId 
      });
    });
  }); // Esta era la llave que faltaba
});

// Recuperar contraseña (versión mejorada)
router.post('/recuperar', (req, res) => {
  const { nombre, correo_electronico } = req.body;

  if (!nombre || !correo_electronico) {
    return res.status(400).json({ 
      error: 'Se requieren tanto el nombre como el correo electrónico' 
    });
  }

  const sql = 'SELECT password FROM usuarios WHERE nombre = ? AND correo_electronico = ?';
  
  db.query(sql, [nombre, correo_electronico], (err, results) => {
    if (err) {
      console.error('Error al recuperar contraseña:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        error: 'No se encontró usuario con esas credenciales' 
      });
    }

    // ⚠️ OPCIÓN TEMPORAL: Enviar contraseña directamente (solo para pruebas)
    // En producción, deberías implementar un sistema de recuperación seguro
    // con tokens temporales y envío por email
    const contrasena = results[0].password;
    res.json({ 
      mensaje: `Tu contraseña es: ${contrasena}`,
      advertencia: 'Este es un método inseguro, solo para desarrollo' 
    });
  });
});

module.exports = router;