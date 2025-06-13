    const express = require('express');
    const cors = require('cors');
    const app = express();

    app.use(cors({
        origin: 'http://localhost:4200', // Ajusta según tu puerto de Angular
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type']
    }));

    app.use(express.json());

    const productosRouter = require('./app/routes/productos.js');
    app.use('/api/productos', productosRouter);
    
    const pedidoRouter = require('./app/routes/pedidos.js');
    app.use('/api/pedidos', pedidoRouter);

    const usuariosRouter = require('./app/routes/user.js');
    app.use('/api/user', usuariosRouter);

    app.listen(3000, () => {
        console.log('Servidor corriendo en http://localhost:3000');
    });