// BACKEND/server.js (Versión Final y Modular)

const express = require('express');
const { dbConnect } = require('./database/db.connector'); // Conexión a MongoDB
const routerApi = require('./routes/api'); // Router principal (Maneja / y /api/users)
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000; // Asumimos puerto 3000

// ----------------------------------------
// MIDDLEWARES GLOBALES Y CONFIGURACIÓN
// ----------------------------------------

// 1. Permite que la API interprete los JSON del body
app.use(express.json()); 

// 2. Permite peticiones desde el frontend (puertos diferentes)
app.use(cors());

// 3. Servir archivos estáticos (Scripts, CSS, Imágenes)
// Esto permite al navegador encontrar /Cineclick/FRONTEND/views/PW_Login.html, etc.
app.use('/Cineclick/FRONTEND', express.static(path.join(__dirname, '..', 'Cineclick', 'FRONTEND')));

// ----------------------------------------
// ENRUTAMIENTO PRINCIPAL
// ----------------------------------------

// 4. USAR EL ROUTER PRINCIPAL SIN PREFIJO
// Esto permite que las rutas que devuelven HTML (/ y /login.html) y las rutas API se activen.
// Si el navegador busca '/', Express lo resuelve en routerApi.get('/')
app.use(routerApi);

// ----------------------------------------
// MANEJO DE ERRORES Y SERVIDOR
// ----------------------------------------

// 5. Manejador de ruta inexistente (Debe ser el último middleware si la ruta falló)
// NOTA: Si tu api.js no manejó la ruta, esta función se activará.
app.use((req, res) => {
    // Si la ruta no fue encontrada por el router, devolvemos un JSON de error 404
    res.status(404).json({ error: 'Endpoint no encontrado o ruta no definida.' });
});


// Conecta a la base de datos y luego inicia el servidor
dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${port}`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor debido a un error de DB:", err);
});