// BACKEND/routes/comments.js
const express = require('express');
const commentsController = require('../controllers/comments_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { authCommentOwnerMiddleware } = require('../middlewares/authCommentOwner');

const routerComments = express.Router();

// POST /comments: Crear un nuevo comentario (Requiere autenticación)
routerComments.post('/', authMiddleware.authRequiredMiddleware, commentsController.createComment);

// GET /comments?reviewId=X
routerComments.get('/', commentsController.getCommentsByReviewId);

// DELETE /comments/:id
routerComments.delete('/:id', authCommentOwnerMiddleware, commentsController.deleteComment);

// PATCH /comments/:id
routerComments.patch('/:id', authCommentOwnerMiddleware, commentsController.updateComment);

// GET /comments/:id
routerComments.get('/:id', commentsController.getCommentById);

module.exports = routerComments;
