const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments_api_controller');
const auth = require('../middlewares/authMiddleware');
const { authCommentOwnerMiddleware } = require('../middlewares/authCommentOwner');

router.post('/', auth.authRequiredMiddleware, commentsController.createComment);
router.get('/', commentsController.getCommentsByReviewId);
router.get('/:id', commentsController.getCommentById);
router.patch('/:id', authCommentOwnerMiddleware, commentsController.updateComment);
router.delete('/:id', authCommentOwnerMiddleware, commentsController.deleteComment);

module.exports = router;
