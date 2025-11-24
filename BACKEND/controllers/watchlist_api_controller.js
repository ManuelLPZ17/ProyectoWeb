// BACKEND/controllers/watchlist_api_controller.js

const watchlistService = require("../services/watchlist_service");

exports.addItemToWatchlist = async (req, res) => {
    try {
        const data = {
            id_user: req.user.id,
            movie_id: req.body.movie_id,
            movie_title: req.body.movie_title,
            movie_poster: req.body.movie_poster,
            status: req.body.status
        };

        const newItem = await watchlistService.createItem(data);
        res.status(201).send(newItem);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

exports.getWatchlist = async (req, res) => {
    const items = await watchlistService.getUserWatchlist(req.user.id);
    res.send(items);
};

exports.getWatchlistItemById = async (req, res) => {
    const item = await watchlistService.getItem(req.params.id);

    if (!item) return res.status(404).send({ error: "Not found" });

    res.send(item);
};

exports.deleteWatchlistItem = async (req, res) => {
    const result = await watchlistService.deleteItem(req.params.id);

    if (!result) return res.status(404).send({ error: "Item not found" });

    res.send({ message: "Deleted successfully" });
};

exports.updateWatchlistItem = async (req, res) => {
    const item = await watchlistService.updateItem(req.params.id, req.body);

    if (!item) return res.status(404).send({ error: "Item not found" });

    res.send(item);
};
