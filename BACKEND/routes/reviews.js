// BACKEND/routes/reviews.js

const express = require('express');
const reviewsController = require('../controllers/reviews_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerReviews = express.Router();

/* ================================
   RUTAS DE RESEÑAS
   ================================ */

/*
   Todas las rutas (menos GET paginado) requieren autenticación.
*/
routerReviews.use(authMiddleware.authRequiredMiddleware);

/* ---------- 1. CREAR RESEÑA (POST /reviews) ---------- */
routerReviews.post('/', reviewsController.createReview);

/* ---------- 2. OBTENER TODAS LAS RESEÑAS DEL USUARIO (GET /reviews) ---------- */
routerReviews.get('/', reviewsController.getAllReviewsByUser);


/* ---------- MIDDLEWARE DE PROPIETARIO PARA RUTAS CON :id ---------- */
// Este middleware valida que LA RESEÑA pertenezca al usuario autenticado
routerReviews.use('/:id', authMiddleware.authOwnerMiddleware);

/* ---------- 3. GET /reviews/:id ---------- */
routerReviews.get('/:id', reviewsController.getReviewById);

/* ---------- 4. PATCH /reviews/:id ---------- */
routerReviews.patch('/:id', reviewsController.updateReview);

/* ---------- 5. DELETE /reviews/:id ---------- */
routerReviews.delete('/:id', reviewsController.deleteReview);


module.exports = routerReviews;
