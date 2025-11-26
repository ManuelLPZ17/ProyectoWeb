const express = require('express');
const router = express.Router();
//const CommentsController = require('../controllers/comments_api_controller');

const commentsController = require('../controllers/comments_api_controller');
const auth = require('../middlewares/authMiddleware');
const { authCommentOwnerMiddleware } = require('../middlewares/authCommentOwner');



// Obtener comentarios por usuario
//router.get('/by-user', CommentsController.getCommentsByUser);

router.post('/', auth.authRequiredMiddleware, commentsController.createComment);
router.get('/', commentsController.getCommentsByReviewId);
router.get('/:id', commentsController.getCommentById);
router.patch('/:id', authCommentOwnerMiddleware, commentsController.updateComment);
router.delete('/:id', authCommentOwnerMiddleware, commentsController.deleteComment);

module.exports = router;