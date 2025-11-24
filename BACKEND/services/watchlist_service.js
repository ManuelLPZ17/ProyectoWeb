// BACKEND/services/watchlist_service.js

const WatchlistItem = require("../schemas/watchlist_schema");

let nextWatchlistId = 1;
let watchlist = []; // simulación de BD

exports.createItem = async (data) => {
    // Validar duplicado: mismo usuario, misma película
    const exists = watchlist.find(i =>
        i.id_user === data.id_user && i.movie_id === data.movie_id
    );

    if (exists) {
        throw new Error("Movie already exists in user's watchlist.");
    }

    const item = new WatchlistItem(data);

    item.id = nextWatchlistId++;
    watchlist.push(item.toObj());

    return item.toObj();
};

exports.getUserWatchlist = async (userId) => {
    return watchlist.filter(i => i.id_user === parseInt(userId));
};

exports.getItem = async (id) => {
    return watchlist.find(i => i.id === parseInt(id)) || null;
};

exports.deleteItem = async (id) => {
    const index = watchlist.findIndex(i => i.id === parseInt(id));
    if (index === -1) return false;

    watchlist.splice(index, 1);
    return true;
};

exports.updateItem = async (id, data) => {
    const item = watchlist.find(i => i.id === parseInt(id));
    if (!item) return null;

    if (data.status) item.status = data.status;

    return item;
};

// Útil para authOwnerMiddleware
exports.getUserIdFromItem = (id) => {
    const item = watchlist.find(i => i.id === parseInt(id));
    return item ? item.id_user : null;
};
