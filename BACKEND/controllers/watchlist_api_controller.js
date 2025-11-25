const axios = require("axios");
const watchlistService = require("../services/watchlist_service");

// 🔥 API KEY DIRECTA
const TMDB_API_KEY = "65f588c6445a775c9a45fed2ecb97ae4";

// -----------------------------------------------------------------------------
// POST /watchlist → agregar película
// -----------------------------------------------------------------------------
exports.addItemToWatchlist = async (req, res) => {
    try {
        const movieId = req.body.movie_id;

        if (!movieId) {
            return res.status(400).send({ error: "movie_id is required" });
        }

        // 1️⃣ Obtener datos reales desde TMDB
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-MX`;

        const tmdbRes = await axios.get(tmdbUrl);
        const movieData = tmdbRes.data;

        // 2️⃣ Armar datos a guardar
            const data = {
                id_user: Number(req.user.id),
                movie_id: Number(movieId),
                movie_title: movieData.title,
                movie_poster: movieData.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                    : null,
                status: req.body.status || "pending",
            };

        // 3️⃣ Guardar
        const newItem = await watchlistService.createItem(data);

        res.status(201).send(newItem);
    } catch (err) {
        console.error(err);

        if (err.response && err.response.status === 404) {
            return res.status(404).send({ error: "Movie not found on TMDB" });
        }

        res.status(500).send({ error: "Error adding movie to watchlist" });
    }
};

// -----------------------------------------------------------------------------
// GET /watchlist → lista del usuario CON DATOS COMPLETOS DESDE TMDB
// -----------------------------------------------------------------------------
exports.getWatchlist = async (req, res) => {
    try {
        const items = await watchlistService.getUserWatchlist(req.user.id);

        const detailedItems = await Promise.all(
            items.map(async (item) => {
                const tmdbUrl =
                    `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${TMDB_API_KEY}&language=es-MX`;

                try {
                    const response = await axios.get(tmdbUrl);
                    const movie = response.data;

                    // Asegura que _id esté presente
                    return {
                        _id: item._id,
                        id_user: item.id_user,
                        movie_id: item.movie_id,
                        movie_title: item.movie_title,
                        movie_poster: item.movie_poster,
                        status: item.status,
                        added_at: item.added_at,
                        movie: {
                            id: movie.id,
                            title: movie.title,
                            overview: movie.overview,
                            genres: movie.genres,
                            release_date: movie.release_date,
                            runtime: movie.runtime,
                            rating: movie.vote_average,
                            poster: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : null,
                            backdrop: movie.backdrop_path
                                ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                                : null,
                        }
                    };

                } catch (e) {
                    return {
                        _id: item._id,
                        id_user: item.id_user,
                        movie_id: item.movie_id,
                        movie_title: item.movie_title,
                        movie_poster: item.movie_poster,
                        status: item.status,
                        added_at: item.added_at,
                        movie: null
                    };
                }
            })
        );

        res.send(detailedItems);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error getting watchlist" });
    }
};

// -----------------------------------------------------------------------------
// GET /watchlist/:id → obtener item específico
// -----------------------------------------------------------------------------
exports.getWatchlistItemById = async (req, res) => {
    const item = await watchlistService.getItem(req.params.id);

    if (!item) return res.status(404).send({ error: "Not found" });

    res.send(item);
};

// -----------------------------------------------------------------------------
// DELETE /watchlist/:id
// -----------------------------------------------------------------------------
exports.deleteWatchlistItem = async (req, res) => {
    const result = await watchlistService.deleteItem(req.params.id);

    if (!result) return res.status(404).send({ error: "Item not found" });

    res.send({ message: "Deleted successfully" });
};

// -----------------------------------------------------------------------------
// PATCH /watchlist/:id
// -----------------------------------------------------------------------------
exports.updateWatchlistItem = async (req, res) => {
    const item = await watchlistService.updateItem(req.params.id, req.body);

    if (!item) return res.status(404).send({ error: "Item not found" });

    res.send(item);
};

