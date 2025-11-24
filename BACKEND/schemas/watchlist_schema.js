// BACKEND/schemas/watchlist_schema.js

class WatchlistItem {
    constructor({ id_user, movie_id, movie_title, movie_poster, status }) {
        this.id = null; // lo asigna el servicio
        this.id_user = id_user;
        this.movie_id = movie_id;           // ID de la película (de tu API externa)
        this.movie_title = movie_title;     // Nombre visible
        this.movie_poster = movie_poster;   // Imagen de portada
        this.status = status || "pending";  // pending | watching | finished
        this.added_at = new Date();         // marca de fecha
    }

    toObj() {
        return {
            id: this.id,
            id_user: this.id_user,
            movie_id: this.movie_id,
            movie_title: this.movie_title,
            movie_poster: this.movie_poster,
            status: this.status,
            added_at: this.added_at
        };
    }
}

module.exports = WatchlistItem;
