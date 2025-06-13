const express = require('express');
const router = express.Router();
const db = require('../api/db.js');

router.get('/', (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: 'Falta el ID del usuario' });
  }

  const sql = 'SELECT * FROM pedido WHERE usuario_id = ?';
  db.query(sql, [user], (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    res.json(results); // Enviamos todos los pedidos en un arreglo
  });
});

router.post('/', (req, res) => {
  const { usuario_id, total, fecha, productos } = req.body;

  console.log(usuario_id)
  console.log(productos)
  if (!usuario_id || !total || !fecha || !productos) {
    return res.status(400).json({ error: 'Faltan datos del pedido' });
  }

  const sql = 'INSERT INTO pedido (usuario_id, total, fecha, productos) VALUES (?, ?, ?, ?)';
  const values = [usuario_id, total, fecha, productos];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al insertar pedido:', err);
      return res.status(500).json({ error: 'Error al guardar el pedido' });
    }

    res.json({ success: true, message: 'Pedido guardado correctamente', id: result.insertId });
  });
});


module.exports = router;