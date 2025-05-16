    const express = require('express');
    const cors = require('cors');
    const app = express();

    app.use(cors({
        origin: 'http://localhost:4200', // Ajusta según tu puerto de Angular
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type']
    }));

    app.use(express.json());

    // Rutas
    const productosRouter = require('./app/routes/productos.js');
    app.use('/api/productos', productosRouter);

    // Manejo de errores
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Algo salió mal!' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    const userRouter = require('./app/routes/user.js');
    app.use('/api/user', userRouter);

    app.listen(3000, () => {
        console.log('Servidor corriendo en http://localhost:3000');
    });
