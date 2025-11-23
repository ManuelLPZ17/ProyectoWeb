// BACKEND/server.js

const express = require('express');
const { dbConnect } = require('./database/db.connector'); // Conexión a MongoDB
const router = require('./routes/api'); // Router principal (users, html files, etc.)
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware Global
app.use(express.json()); // Permite que la API interprete los JSON del body [cite: 106]
app.use(cors());         // Permite peticiones desde el frontend (puertos diferentes)
app.use(router);         // Usa el router principal para manejar todas las rutas [cite: 107]

// Conecta a la base de datos y luego inicia el servidor
dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`corriendo en el puerto ${port}!`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor debido a un error de DB:", err);
});