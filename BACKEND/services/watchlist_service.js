// BACKEND/services/watchlist_service.js

// SIMULACIÓN DE DATOS
let watchlist = []; 

exports.saveWatchlistItem = async (itemObject) => {
    // Aquí iría la validación de duplicado (mismo usuario/misma película)
    watchlist.push(itemObject.toObj());
    return itemObject.toObj();
};

exports.getWatchlistItemById = async (id) => {
    return watchlist.find(w => w.id === parseInt(id)) || null;
};

exports.getAllWatchlistItems = async () => {
    return watchlist;
};

// Necesario para la validación de integridad: verificar si un usuario tiene elementos
exports.findItemsByUserId = async (userId) => {
    return watchlist.filter(w => w.id_user === parseInt(userId));
};