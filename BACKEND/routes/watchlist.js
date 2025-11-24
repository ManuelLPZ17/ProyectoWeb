// BACKEND/routes/watchlist.js

const express = require('express');
const watchlistController = require('../controllers/watchlist_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerWatchlist = express.Router();

// POST /watchlist: Agregar película
routerWatchlist.post(
    '/', 
    authMiddleware.authRequiredMiddleware, 
    watchlistController.addItemToWatchlist
);

// GET /watchlist: Obtener lista del usuario
routerWatchlist.get(
    '/', 
    authMiddleware.authRequiredMiddleware, 
    watchlistController.getWatchlist
);

// GET /watchlist/:id — Obtener item específico (protegido)
routerWatchlist.get(
    '/:id',
    authMiddleware.authRequiredMiddleware,
    watchlistController.getWatchlistItemById
);

// DELETE /watchlist/:id — Borra solo si pertenece al usuario
routerWatchlist.delete(
    '/:id',
    authMiddleware.authRequiredMiddleware,
    watchlistController.deleteWatchlistItem
);

// PATCH /watchlist/:id — No implementado, pero protegido
routerWatchlist.patch(
    '/:id',
    authMiddleware.authRequiredMiddleware,
    watchlistController.updateWatchlistItem
);

module.exports = routerWatchlist;
