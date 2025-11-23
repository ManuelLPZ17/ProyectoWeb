// BACKEND/routes/comments.js

const express = require('express');
const commentsController = require('../controllers/comments_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerComments = express.Router();

// POST /comments: Crear un nuevo comentario (Requiere autenticación)
routerComments.post('/', authMiddleware.authRequiredMiddleware, commentsController.createComment);

// GET /comments?reviewId=X: Obtener comentarios por ID de reseña
routerComments.get('/', commentsController.getCommentsByReviewId);

// DELETE /comments/:id (Requiere autenticación del propietario)
routerComments.delete('/:id', authMiddleware.authOwnerMiddleware, commentsController.deleteComment);

// PATCH /comments/:id
routerComments.patch('/:id', authMiddleware.authOwnerMiddleware, commentsController.updateComment);

// GET /comments/:id
routerComments.get('/:id', commentsController.getCommentById);


module.exports = routerComments;