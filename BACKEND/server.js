const express = require('express');
const { dbConnect } = require('./database/db.connector');
const routerApi = require('./routes/api');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// ----------------------------------------
// MIDDLEWARES GLOBALES
// ----------------------------------------
app.use(express.json());    // Debe ir antes de cualquier ruta
app.use(cors());            // Igual

// Archivos estáticos
app.use(
    '/Cineclick/FRONTEND',
    express.static(path.join(__dirname, '..', 'Cineclick', 'FRONTEND'))
);

// ----------------------------------------
// RUTAS
// ----------------------------------------
app.use("/watchlist", require("./routes/watchlist"));  // <-- AHORA SÍ FUNCIONA

app.use(routerApi);  // Router principal

// ----------------------------------------
// MANEJO DE RUTAS NO EXISTENTES
// ----------------------------------------
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado o ruta no definida.' });
});

// ----------------------------------------
// INICIAR SERVIDOR
// ----------------------------------------
dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${port}`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor debido a un error de DB:", err);
});
