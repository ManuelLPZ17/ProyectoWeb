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
    movie_title: String,
    movie_poster: String,
    status: {
        type: String,
        enum: ["pending", "watching", "finished"],
        default: "pending"
    },
    added_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Watchlist", WatchlistSchema);
