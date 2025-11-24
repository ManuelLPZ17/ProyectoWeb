const express = require('express');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

const routerApi = express.Router();

// --- Importación de Routers Modulares ---
const usersRouter = require('./users');
const reviewsRouter = require('./reviews'); // Faltan crear
const tagsRouter = require('./tags');       // Faltan crear
const commentsRouter = require('./comments');
const watchlistRouter = require('./watchlist');
const authRouter = require('./auth');

// --- MIDDLEWARE DE AUTENTICACIÓN (Rutas que devuelven HTML) ---
// Solo protege los HTML que requieren login
routerApi.use(
  ['/home.html', '/tasks.html'], 
  authMiddleware.authRequiredMiddleware, 
  (req, res, next) => next()
);

// --- RUTAS QUE DEVUELVEN ARCHIVOS HTML ---

// RUTA RAIZ /
routerApi.get('/', (req, res) => {
  const authHeader = req.headers['x-auth'];
  const filePath = authHeader
    ? path.resolve(__dirname + '/../../Cineclick/FRONTEND/views/PW_Home.html')
    : path.resolve(__dirname + '/../../Cineclick/FRONTEND/views/PW_Login.html');

  res.sendFile(filePath);
});

// RUTA /login.html
routerApi.get('/login.html', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../../Cineclick/FRONTEND/views/PW_Login.html'));
});

// RUTA /home.html
routerApi.get('/home.html', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../../Cineclick/FRONTEND/views/PW_Home.html'));
});

// RUTA /tasks.html (placeholder de movies/reseñas)
routerApi.get('/tasks.html', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../../Cineclick/FRONTEND/views/PW_Movie.html'));
});

// --- ENRUTAMIENTO API MODULAR ---
// Asegúrate de que todas las rutas de API tengan prefijo coherente

routerApi.use('/users', usersRouter);             // /users
routerApi.use('/api/reviews', reviewsRouter);     // /api/reviews
routerApi.use('/api/tags', tagsRouter);           // /api/tags
routerApi.use('/api/comments', commentsRouter);   // /api/comments
routerApi.use('/api/watchlist', watchlistRouter); // /api/watchlist
routerApi.use('/api/auth', authRouter);           // /api/auth

module.exports = routerApi;
