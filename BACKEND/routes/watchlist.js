// BACKEND/routes/watchlist.js

const express = require('express');
const watchlistController = require('../controllers/watchlist_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerWatchlist = express.Router();

// POST /watchlist: Agregar una película (Requiere autenticación)
routerWatchlist.post('/', authMiddleware.authRequiredMiddleware, watchlistController.addItemToWatchlist);

// GET /watchlist: Obtener la lista del usuario (Requiere autenticación)
routerWatchlist.get('/', authMiddleware.authRequiredMiddleware, watchlistController.getWatchlist);

// DELETE /watchlist/:id (Requiere autenticación del propietario)
routerWatchlist.delete('/:id', authMiddleware.authOwnerMiddleware, watchlistController.deleteWatchlistItem);

// PATCH /watchlist/:id (Requiere autenticación del propietario)
routerWatchlist.patch('/:id', authMiddleware.authOwnerMiddleware, watchlistController.updateWatchlistItem);

// GET /watchlist/:id
routerWatchlist.get('/:id', watchlistController.getWatchlistItemById);

module.exports = routerWatchlist;