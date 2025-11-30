// BACKEND/controllers/comments_api_controller.js

const Comment = require('../models/comment');
const CommentService = require('../services/comments_service');
const ReviewService = require('../services/reviews_service');
const UserService = require('../services/users_service');


// CREATE COMMENT
exports.createComment = async (req, res) => {
    try {
       // console.log("📩 BODY RECIBIDO:", req.body);
        //console.log("📌 req.userId:", req.userId);

        const { id_review, content } = req.body;
        const owner = req.userId;

        // Validar reseña
        const review = await ReviewService.getReviewById(id_review);
        if (!review) {
            return res.status(404).send("Review not found.");
        }

        // Validar usuario
        const user = await UserService.getUserById(owner);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Crear instancia de comentario (sin ID todavía)
        const comment = new Comment({
            id_review,
            movie_id: review.movie_id,
            owner,
            owner_name: user.name,
            content
        });

        // Generar objeto final con ID autoincremental
        const obj = await comment.toObj();

        await CommentService.saveComment(obj);

        res.status(201).json({
            message: "Comment created successfully",
            data: obj
        });

    } catch (err) {
        console.error("🔥 ERROR BACKEND:", err);
        res.status(400).send(err.message);
    }
};

// GET comments by review
exports.getCommentsByReviewId = async (req, res) => {
    try {
        const reviewId = parseInt(req.query.reviewId);

        const comments = await CommentService.findCommentsByReviewId(reviewId);

        res.json(comments);
    } catch (err) {
        res.status(500).send("Error retrieving comments.");
    }
};


// GET comments by user
exports.getCommentsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) return res.status(400).send("Invalid user id");

        const comments = await CommentService.findCommentsByUserId(userId);
        res.json(comments);
    } catch (err) {
        res.status(500).send("Error retrieving user's comments.");
    }
};


// GET comment by id
exports.getCommentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const comment = await CommentService.getCommentById(id);

        if (!comment) return res.status(404).send("Comment not found");

        res.json(comment);
    } catch (err) {
        res.status(500).send("Error retrieving comment.");
    }
};


// UPDATE comment
exports.updateComment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { content } = req.body;

        const updated = await CommentService.updateComment(id, { content });

        res.json(updated);
    } catch (err) {
        res.status(400).send("Error updating comment.");
    }
};


// DELETE comment
exports.deleteComment = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const deleted = await CommentService.deleteComment(id);

        res.json(deleted);
    } catch (err) {
        res.status(500).send("Error deleting comment.");
    }
};