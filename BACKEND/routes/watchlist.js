const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlist_api_controller");
const { authRequiredMiddleware } = require("../middlewares/authMiddleware");

// Crear item
router.post("/", authRequiredMiddleware, watchlistController.addItemToWatchlist);

// Obtener mi watchlist
router.get("/", authRequiredMiddleware, watchlistController.getWatchlist);

// Obtener un item por ID
router.get("/:id", authRequiredMiddleware, watchlistController.getWatchlistItemById);

// Actualizar item
router.patch("/:id", authRequiredMiddleware, watchlistController.updateWatchlistItem);

// Eliminar item
router.delete("/:id", authRequiredMiddleware, watchlistController.deleteWatchlistItem);

module.exports = router;

