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

router.put('/actualizar-stock', (req, res) => {
    // Añade logs para diagnóstico
    console.log('Body recibido:', req.body);
    
    // Verifica que el body sea un array
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ 
            success: false,
            message: 'Se requiere un array de productos' 
        });
    }

    const productos = req.body.map(p => ({
        id: parseInt(p.id),
        cantidad: parseInt(p.cantidadComprada) 
    }));

    
    if (productos.length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'El array de productos está vacío' 
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error('Error iniciando transacción:', err);
            return res.status(500).json({ 
                success: false,
                message: 'Error al iniciar transacción' 
            });
        }

        const updates = productos.map(producto => {
            return new Promise((resolve, reject) => {
                // Validación más estricta
                if(typeof producto.id !== 'number' || typeof producto.cantidad !== 'number') {
                    console.error('Datos inválidos:', producto);
                    return reject(new Error(`Datos inválidos para producto. Se esperaban id y cantidadComprada como números`));
                }

                // Primero obtenemos el stock actual con bloqueo
                db.query(
                    'SELECT stock FROM productos WHERE id = ? FOR UPDATE', 
                    [producto.id],
                    (err, results) => {
                        if (err) {
                            console.error('Error en SELECT:', err);
                            return reject(err);
                        }
                        
                        if (results.length === 0) {
                            console.error('Producto no encontrado:', producto.id);
                            return reject(new Error(`Producto no encontrado con ID: ${producto.id}`));
                        }

                        const stockActual = results[0].stock;
                        const nuevoStock = stockActual - producto.cantidad;

                        if (nuevoStock < 0) {
                            console.error('Stock insuficiente:', {id: producto.id, stockActual, cantidadComprada: producto.cantidadComprada});
                            return reject(new Error(`Stock insuficiente para el producto ID: ${producto.id}. Stock actual: ${stockActual}, se intentó comprar: ${producto.cantidadComprada}`));
                        }

                        // Actualizamos el stock
                        db.query(
                            'UPDATE productos SET stock = ? WHERE id = ?', 
                            [nuevoStock, producto.id],
                            (err, result) => {
                                if (err) {
                                    console.error('Error en UPDATE:', err);
                                    return reject(err);
                                }
                                console.log('Stock actualizado para producto:', producto.id, 'nuevo stock:', nuevoStock);
                                resolve(result);
                            }
                        );
                    }
                );
            });
        });

        Promise.all(updates)
            .then(() => {
                db.commit(err => {
                    if (err) {
                        console.error('Error en commit:', err);
                        return db.rollback(() => {
                            res.status(500).json({ 
                                success: false,
                                message: 'Error al confirmar transacción' 
                            });
                        });
                    }
                    console.log('Transacción completada con éxito');
                    res.json({ 
                        success: true,
                        message: 'Stock actualizado correctamente',
                        updatedCount: productos.length
                    });
                });
            })
            .catch(error => {
                console.error('Error en actualización:', error);
                db.rollback(() => {
                    res.status(400).json({ 
                        success: false,
                        message: error.message,
                        errorDetails: error 
                    });
                });
            });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {stock} = req.body;

    if( stock === undefined) {
        return res.status(400).json({ error: 'Stock es requerido' });
    }

    const sql = 'UPDATE productos SET stock = ? WHERE id = ?';
    db.query(sql, [stock, id], (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        
        if(result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto actualizado', producto: { id, stock } });
    }); 
}
);

module.exports = router;