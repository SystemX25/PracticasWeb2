const express = require('express');
const router = express.Router();
const db = require('../api/db.js');

// Obtener todos los productos
// Obtener todos los productos
router.get('/', (req, res) => {
    db.query('SELECT id, nombre, precio, imagen, stock FROM productos', (err, rows) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        
        // Asegurarse de devolver los datos en el formato correcto
        const productos = rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            precio: row.precio,
            imagen: row.imagen || 'assets/noimagen.jpg',
            stock: row.stock
        }));
        
        res.json(productos);
    });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const { id, nombre, precio, imagen } = req.body;
    
    if (!nombre || precio === undefined) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const sql = 'INSERT INTO productos (id, nombre, precio, imagen) VALUES (?, ?, ?, ?)';
    db.query(sql, [id, nombre, precio, imagen || 'assets/noimagen.jpg'], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        res.status(201).json({ 
            message: 'Producto agregado', 
            producto: { id, nombre, precio, imagen } 
        });
    });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        
        if(result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado' });
    });
});

module.exports = router;