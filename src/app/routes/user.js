const express = require('express');
const router = express.Router();
const db = require('../api/db.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'serviciotecnicopfc@gmail.com', 
    pass: 'iapl vrer nomb hxha' 
  }
});

router.get('/', (req, res) => {
  const { nombre, password } = req.query;
  console.log('Nombre:', nombre);
  console.log("password", password);

  let sql = 'SELECT * FROM usuarios';
  let params = [];

  if (!nombre|| !password) {
    return res.status(500).json({ error: 'Error del servidor' });
  }

  sql += ' WHERE correo = ? AND password = ?';
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
  }); // Esta era la llave que faltaba
});

router.post('/recuperar', (req, res) => {
  const { correo_electronico } = req.body;

  if (!correo_electronico) {
    return res.status(400).json({ error: 'El correo es requerido' });
  }

  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  db.query('SELECT id FROM usuarios WHERE correo = ?', [correo_electronico], (err, results) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.json({ 
        mensaje: 'Si el correo existe, recibirás un enlace de recuperación' 
      });
    }

    const userId = results[0].id;
    

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    db.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expira = ? WHERE id = ?',
      [token, expiresAt, userId],
      (err) => {
        if (err) {
          console.error('Error al guardar token:', err);
          return res.status(500).json({ error: 'Error del servidor' });
        }

        // 4. Enviar el correo
        const resetLink = `http://localhost:4200/reset-password?token=${token}&id=${userId}`;
        
        const mailOptions = {
          from: 'serviciotecnicopfc@gmail.com',
          to: correo_electronico,
          subject: 'Recuperación de contraseña',
          text: `Para restablecer tu contraseña, haz clic en este enlace: ${resetLink}\n\nEste enlace expirará en 1 hora.`
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.error('Error al enviar email:', error);
            return res.status(500).json({ error: 'Error al enviar el correo' });
          }

          res.json({ 
            mensaje: 'Se ha enviado un enlace de recuperación a tu correo' 
          });
        });
      }
    );
  });
});

router.post('/reset-password', (req, res) => {
  const { token, userId, nuevaContrasena } = req.body;

  // 1. Verificar token válido y no expirado
  db.query(
    'SELECT id FROM usuarios WHERE id = ? AND reset_token = ? AND reset_token_expira > NOW()',
    [userId, token],
    (err, results) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }

      // 2. Actualizar contraseña y limpiar token
      db.query(
        'UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expira = NULL WHERE id = ?',
        [nuevaContrasena, userId],
        (err) => {
          if (err) {
            console.error('Error al actualizar contraseña:', err);
            return res.status(500).json({ error: 'Error del servidor' });
          }

          res.json({ mensaje: 'Contraseña actualizada correctamente' });
        }
      );
    }
  );
});

// Obtener perfil
router.get('/perfil/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT id, nombre, correo FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// Editar perfil
router.put('/perfil/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, correo, password } = req.body;

  const sql = 'UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?';
  db.query(sql, [nombre, correo, password, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
    res.json({ success: true, message: 'Perfil actualizado correctamente' });
  });
});


module.exports = router;