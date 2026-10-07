const express = require('express');
const tmdbController = require('../controllers/tmdb_api_controller');

const router = express.Router();

router.get('/movie/popular', tmdbController.getPopularMovies);
router.get('/movie/:id/credits', tmdbController.getMovieCredits);
router.get('/movie/:id', tmdbController.getMovie);
router.get('/search/movie', tmdbController.searchMovies);
router.get('/discover/movie', tmdbController.discoverMovies);

module.exports = router;
