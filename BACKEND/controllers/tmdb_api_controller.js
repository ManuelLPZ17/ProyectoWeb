const axios = require('axios');
const config = require('../config/config');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function requestTmdb(res, path, params = {}) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}${path}`, {
            params: {
                ...params,
                api_key: config.TMDB_API_KEY
            },
            timeout: 10000
        });

        res.json(response.data);
    } catch (err) {
        const status = err.response?.status || 502;
        res.status(status).json({ error: 'No se pudo obtener información de TMDb.' });
    }
}

exports.getMovie = (req, res) => requestTmdb(
    res,
    `/movie/${encodeURIComponent(req.params.id)}`,
    { language: req.query.language || 'es-ES' }
);

exports.getMovieCredits = (req, res) => requestTmdb(
    res,
    `/movie/${encodeURIComponent(req.params.id)}/credits`,
    { language: req.query.language || 'es-ES' }
);

exports.getPopularMovies = (req, res) => requestTmdb(
    res,
    '/movie/popular',
    { language: req.query.language || 'es-ES', page: req.query.page || 1 }
);

exports.searchMovies = (req, res) => requestTmdb(
    res,
    '/search/movie',
    {
        language: req.query.language || 'es-ES',
        query: req.query.query || '',
        page: req.query.page || 1
    }
);

exports.discoverMovies = (req, res) => requestTmdb(
    res,
    '/discover/movie',
    {
        language: req.query.language || 'es-ES',
        with_genres: req.query.with_genres || '',
        sort_by: 'popularity.desc',
        page: req.query.page || 1
    }
);
