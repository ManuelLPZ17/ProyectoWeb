// BACKEND/routes/api.js

const express = require('express');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

const routerApi = express.Router();

// --- Importación de Routers Modulares ---
const usersRouter = require('./users');
const reviewsRouter = require('./reviews'); // Faltan crear
const tagsRouter = require('./tags');       // Faltan crear
const commentsRouter = require('./comments');

// --- MIDDLEWARE DE AUTENTICACIÓN (Rutas que devuelven HTML) ---

// Middleware que valida si el usuario está autenticado para acceder a archivos protegidos
routerApi.use(['/home.html', '/tasks.html'], authMiddleware.authRequiredMiddleware, (req, res, next) => {
    next();
});

// --- RUTAS QUE DEVUELVEN ARCHIVOS HTML ---

// RUTA RAIZ /
// Regla: Si tiene autenticación, regresa home.html. Si no, regresa login.html. [cite: 80-81]
routerApi.get('/', (req, res) => {
    const authHeader = req.headers['x-auth'];
    const filePath = (authHeader) 
        ? path.resolve(__dirname + "/../../Cineclick/FRONTEND/views/PW_Home.html")
        : path.resolve(__dirname + "/../../Cineclick/FRONTEND/views/PW_Login.html");
        
    res.sendFile(filePath);
});

// RUTA /login.html
// Regla: Siempre regresa login.html. [cite: 83]
routerApi.get('/login.html', (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/PW_Login.html"));
});

// RUTA /home.html
// Regla: Regresa home.html si pasa la autenticación (manejada por el middleware de arriba). [cite: 82]
routerApi.get('/home.html', (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/PW_Home.html"));
});

// RUTA /tasks.html
// Regla: Regresa tasks.html si pasa la autenticación (manejada por el middleware de arriba). [cite: 84]
routerApi.get('/tasks.html', (req, res) => {
    // Usaremos PW_Movie.html como placeholder para tasks.html/reseñas
    res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/PW_Movie.html"));
});

// --- ENRUTAMIENTO API MODULAR ---
routerApi.use('/users', usersRouter);
routerApi.use('/reviews', reviewsRouter); 
routerApi.use('/tags', tagsRouter);
routerApi.use('/comments', commentsRouter);
module.exports = routerApi;