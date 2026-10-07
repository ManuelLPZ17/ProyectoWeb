const express = require('express');
const { dbConnect } = require('./database/db.connector');
const routerApi = require('./routes/api');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

const app = express();
const port = config.PORT;

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
app.use("/watchlist", require("./routes/watchlist"));
app.use("/tags", require("./routes/tags"));

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
try {
    config.validateConfig(['DB_HOST', 'ADMIN_AUTH_KEY', 'TMDB_API_KEY']);
} catch (err) {
    console.error(`Error de configuración: ${err.message}`);
    process.exitCode = 1;
    return;
}

dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${port}`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor debido a un error de DB:", err);
});
