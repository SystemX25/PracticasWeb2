    const express = require('express');
    const cors = require('cors');
    const app = express();
    app.use(cors());
    app.use(express.json());
    const productosRouter = require('./app/routes/productos.js');
    app.use('/api/productos', productosRouter);
    const userRouter = require('./app/routes/user.js');
    app.use('/api/user', userRouter);

    app.listen(3000, () => {
        console.log('Servidor corriendo en http://localhost:3000');
    });
    
