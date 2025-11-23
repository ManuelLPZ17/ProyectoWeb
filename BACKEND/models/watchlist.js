// BACKEND/models/watchlist.js

let nextWatchlistId = 1;
function getNextWatchlistID() {
    return nextWatchlistId++;
}

class WatchlistException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

class Watchlist {
    #id;
    #id_user;   // ID del usuario propietario
    #id_movie;  // ID de la película (TMDb ID)
    #added_at;

    constructor(id_user, id_movie) {
        this.#id = getNextWatchlistID();
        this.#added_at = new Date().toISOString();
        
        this.id_user = id_user;
        this.id_movie = id_movie;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get id_user() { return this.#id_user; }
    get id_movie() { return this.#id_movie; }
    get added_at() { return this.#added_at; }

    // --- SETTERS con Validación ---
    set id(value) {
        throw new WatchlistException("IDs are auto-generated. Cannot be modified.");
    }
    set id_user(value) {
        if (!value) throw new WatchlistException("Watchlist must be linked to a User (id_user).");
        // Regla: El usuario debe existir (validación en el controlador)
        this.#id_user = value;
    }
    set id_movie(value) {
        if (!value) throw new WatchlistException("Watchlist item must have a Movie ID (id_movie).");
        // Regla: El movie ID debe existir (validación en el controlador)
        // Regla: No duplicados (validación en el controlador)
        this.#id_movie = value;
    }
    set added_at(value) {
        throw new WatchlistException("Added date cannot be modified.");
    }

    toObj() {
        return {
            id: this.#id,
            id_user: this.#id_user,
            id_movie: this.#id_movie,
            added_at: this.#added_at,
        };
    }
}

module.exports = { getNextWatchlistID, WatchlistException, Watchlist };