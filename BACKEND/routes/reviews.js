// BACKEND/routes/reviews.js

const express = require('express');
const reviewsController = require('../controllers/reviews_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerReviews = express.Router();

// Middleware de autenticación para todas las rutas de reseñas (excepto GET paginado)
// routerReviews.use('/', authMiddleware.authRequiredMiddleware); // Asumiendo que POST requiere saber quién es el usuario

// POST /reviews: Crea una nueva reseña (Requiere autenticación)
routerReviews.post('/', reviewsController.createReview);

// GET /reviews: Obtener todas las reseñas del usuario (Requiere autenticación)
routerReviews.get('/', authMiddleware.authRequiredMiddleware, reviewsController.getAllReviewsByUser);

// Rutas por ID (GET, PATCH, DELETE)
// Aplicamos el middleware de propietario para asegurar que el usuario sea el dueño de la reseña
routerReviews.use('/:id', authMiddleware.authOwnerMiddleware);

// GET /reviews/:id
routerReviews.get('/:id', reviewsController.getReviewById);

// PATCH /reviews/:id
routerReviews.patch('/:id', reviewsController.updateReview);

// DELETE /reviews/:id
routerReviews.delete('/:id', reviewsController.deleteReview);

module.exports = routerReviews;