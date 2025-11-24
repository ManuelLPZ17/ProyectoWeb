const Watchlist = require("../models/watchlist");

exports.createItem = async (data) => {
    // Validar duplicado
    const exists = await Watchlist.findOne({
        id_user: data.id_user,
        movie_id: data.movie_id
    });

    if (exists) {
        throw new Error("Movie already exists in user's watchlist.");
    }

    const item = new Watchlist(data);
    await item.save();
    return item;
};

exports.getUserWatchlist = async (userId) => {
    return await Watchlist.find({ id_user: userId });
};

exports.getItem = async (id) => {
    return await Watchlist.findById(id);
};

exports.deleteItem = async (id) => {
    const result = await Watchlist.findByIdAndDelete(id);
    return result !== null;
};

exports.updateItem = async (id, data) => {
    const item = await Watchlist.findByIdAndUpdate(id, data, { new: true });
    return item;
};

exports.getUserIdFromItem = async (id) => {
    const item = await Watchlist.findById(id);
    return item ? item.id_user : null;
};
