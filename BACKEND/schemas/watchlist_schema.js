const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
    id_user: {
        type: Number,
        required: true
    },
    movie_id: {
        type: Number,
        required: true
    },
    movie_title: {
        type: String,
        required: false
    },
    movie_poster: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["pending", "watching", "completed"],
        default: "pending"
    }
}, { versionKey: false });

// Exportar modelo
module.exports = mongoose.model("WatchlistItem", WatchlistSchema);