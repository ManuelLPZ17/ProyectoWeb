// BACKEND/controllers/comments_api_controller.js

const Comment = require('../models/comment');
const ReviewService = require('../services/reviews_service');
const UserService = require('../services/users_service');

// =======================
// CREATE COMMENT
// =======================
exports.createComment = async (req, res) => {
    try {
        const { id_review, content } = req.body;
        const owner = req.userId;

        // Validar reseña
        const review = await ReviewService.getReviewById(id_review);
        if (!review) return res.status(404).send("Review not found.");

        // Validar usuario
        const user = await UserService.getUserById(owner);
        if (!user) return res.status(404).send("User not found.");

        // Crear comentario
        const comment = new Comment({
            id_review,
            movie_id: review.movie_id,
            owner,
            owner_name: user.name,
            content
        });

        await comment.save();

        res.status(201).json({
            message: "Comment created successfully",
            data: comment
        });

    } catch (err) {
        console.error('Error creando comentario:', err);
        res.status(400).send(err.message);
    }
};

// =======================
// GET COMMENTS BY REVIEW
// =======================
exports.getCommentsByReviewId = async (req, res) => {
    try {
        const reviewId = parseInt(req.query.reviewId);
        const comments = await Comment.find({ id_review: reviewId }).sort({ created_at: -1 });
        res.json(comments);
    } catch (err) {
        console.error('Error obteniendo comentarios por review:', err);
        res.status(500).send("Error retrieving comments.");
    }
};

// =======================
// GET COMMENT BY ID
// =======================
exports.getCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).send("Comment not found");
        res.json(comment);
    } catch (err) {
        console.error('Error obteniendo comentario por ID:', err);
        res.status(500).send("Error retrieving comment.");
    }
};

// =======================
// UPDATE COMMENT
// =======================
exports.updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;
        const updated = await Comment.findByIdAndUpdate(
            id,
            { content },
            { new: true } // Devuelve el documento actualizado
        );
        res.json(updated);
    } catch (err) {
        console.error('Error actualizando comentario:', err);
        res.status(400).send("Error updating comment.");
    }
};

// =======================
// DELETE COMMENT
// =======================
exports.deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Comment.findByIdAndDelete(id);
        res.json(deleted);
    } catch (err) {
        console.error('Error eliminando comentario:', err);
        res.status(500).send("Error deleting comment.");
    }
};

// =======================
// GET COMMENTS BY USER
// =======================
exports.getCommentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.find({ owner: parseInt(userId) }).sort({ created_at: -1 });
        res.json(comments);
    } catch (err) {
        console.error('Error en getCommentsByUser:', err);
        res.status(500).json({ error: 'Error al obtener los comentarios del usuario' });
    }
};
