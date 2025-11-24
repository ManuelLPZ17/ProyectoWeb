// BACKEND/routes/watchlist.js

const express = require("express");
const watchlistController = require("../controllers/watchlist_api_controller");
const authMiddleware = require("../middlewares/authMiddleware");
const ownerMiddleware = require("../middlewares/authOwnerMiddleware");

const routerWatchlist = express.Router();

routerWatchlist.post(
    "/",
    authMiddleware.authRequiredMiddleware,
    watchlistController.addItemToWatchlist
);

routerWatchlist.get(
    "/",
    authMiddleware.authRequiredMiddleware,
    watchlistController.getWatchlist
);

routerWatchlist.get("/:id", watchlistController.getWatchlistItemById);

routerWatchlist.delete(
    "/:id",
    authMiddleware.authRequiredMiddleware,
    ownerMiddleware.authOwnerMiddleware,
    watchlistController.deleteWatchlistItem
);

routerWatchlist.patch(
    "/:id",
    authMiddleware.authRequiredMiddleware,
    ownerMiddleware.authOwnerMiddleware,
    watchlistController.updateWatchlistItem
);

module.exports = routerWatchlist;
