// BACKEND/routes/reviews.js

const express = require('express');
const reviewsController = require('../controllers/reviews_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { authReviewOwnerMiddleware } = require('../middlewares/authReviewOwner');

const routerReviews = express.Router();

/* ================================
   RUTAS DE RESEÑAS
   ================================ */

/*
   Todas las rutas (menos GET /reviews/all) requieren autenticación.
*/

// Primero declaramos el GET de todas las reseñas (no requiere auth)
routerReviews.get('/all', reviewsController.getAllReviews);

// Ahora activamos el middleware global de autenticación para el resto
routerReviews.use(authMiddleware.authRequiredMiddleware);

/* ---------- 1. CREAR RESEÑA ---------- */
routerReviews.post('/', reviewsController.createReview);

/* ---------- 2. OBTENER TODAS LAS RESEÑAS DEL USUARIO ---------- */
routerReviews.get('/', reviewsController.getAllReviewsByUser);

/* ---------- Middleware de propietario ---------- */
routerReviews.use('/:id', authReviewOwnerMiddleware);

/* ---------- 3. OBTENER RESEÑA POR ID ---------- */
routerReviews.get('/:id', reviewsController.getReviewById);

/* ---------- 4. ACTUALIZAR RESEÑA ---------- */
routerReviews.patch('/:id', reviewsController.updateReview);

/* ---------- 5. ELIMINAR RESEÑA ---------- */
routerReviews.delete('/:id', reviewsController.deleteReview);

module.exports = routerReviews;
