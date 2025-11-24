// BACKEND/controllers/comments_api_controller.js

const { Comment, CommentException } = require('../models/comment');
const CommentService = require('../services/comments_service');
const ReviewService = require('../services/reviews_service'); // Para validar la reseña
const UserService = require('../services/users_service');   // Para validar el usuario


// 1. CREAR COMENTARIO (POST /comments)
exports.createComment = async (req, res) => {
    try {
        const { id_review, content } = req.body;
        // Asumiendo que id_user viene del middleware de autenticación
        const id_user = req.userId || 1; 

        // 1. Validar integridad: La reseña (Review/Task) debe existir
        const reviewExists = await ReviewService.getReviewById(id_review);
        if (!reviewExists) {
            return res.status(400).send("Review ID does not exist. Cannot post comment.");
        }
        
        // 2. Validar integridad: El usuario que comenta debe existir
        const userExists = await UserService.getUserById(id_user);
        if (!userExists) {
            return res.status(400).send("User ID is invalid or does not exist.");
        }

        // 3. Crear el objeto Comment (Esto ejecuta las validaciones del modelo: content no vacío)
        const newComment = new Comment(id_review, id_user, content);
        
        // 4. Persistir en la DB (servicio)
        await CommentService.saveComment(newComment);

        res.status(201).json({ 
            message: "Comment created successfully.", 
            comment: newComment.toObj() 
        });
        
    } catch (err) {
        // Captura excepciones del modelo (ej. content vacío, id_review inválido)
        res.status(400).send(err.errorMessage || "Error creating comment. Invalid data.");
    }
};

// 2. OBTENER COMENTARIOS por ID de Reseña (GET /comments?reviewId=X)
exports.getCommentsByReviewId = async (req, res) => {
    try {
        const reviewId = parseInt(req.query.reviewId);
        
        if (!reviewId) {
             return res.status(400).send("Missing reviewId query parameter.");
        }
        
        // La reseña debe existir para consultar sus comentarios
        const reviewExists = await ReviewService.getReviewById(reviewId);
        if (!reviewExists) {
            return res.status(404).send("Review not found.");
        }

        const comments = await CommentService.findCommentsByReviewId(reviewId);

        res.json({ 
            message: `Comments for review ${reviewId} retrieved successfully.`, 
            data: comments 
        });
        
    } catch (err) {
        res.status(500).send("Error retrieving comments.");
    }
};

// 3. ELIMINAR COMENTARIO (DELETE /comments/:id)
exports.deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.id);
    const id_user = req.userId || 1; // Usuario autenticado

    try {
        // 1. Buscar el comentario y validar su existencia
        const commentToDelete = await CommentService.getCommentById(commentId);
        if (!commentToDelete) {
            return res.status(404).send("Comment not found.");
        }
        
        // 2. Validar que el usuario autenticado sea el propietario del comentario
        if (commentToDelete.id_user !== id_user) {
            return res.status(403).send("Forbidden: You do not own this comment.");
        }

        // 3. Eliminar de la DB
        const deletedComment = await CommentService.deleteComment(commentId);

        res.json({ message: `Comment with id ${commentId} deleted!`, comment: deletedComment });
        
    } catch (err) {
        res.status(500).send("Error deleting comment.");
    }
};

// 4. ACTUALIZAR COMENTARIO (PATCH /comments/:id)
exports.updateComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const { content } = req.body;
        const id_user = req.userId || 1; // Usuario autenticado

        // 1. Validar que el comentario exista
        const commentToEdit = await CommentService.getCommentById(commentId);
        if (!commentToEdit) {
            return res.status(404).send("Comment not found.");
        }

        // 2. Validar que este usuario sea el dueño del comentario
        if (commentToEdit.id_user !== id_user) {
            return res.status(403).send("Forbidden: You do not own this comment.");
        }

        // 3. Validar que el contenido no esté vacío (modelo también lo valida)
        if (!content || content.trim().length === 0) {
            return res.status(400).send("Content cannot be empty.");
        }

        // 4. Actualizar en DB
        const updatedComment = await CommentService.updateComment(commentId, { content });

        res.json({
            message: "Comment updated successfully.",
            comment: updatedComment
        });

    } catch (err) {
        res.status(400).send(err.errorMessage || "Error updating comment.");
    }
};



exports.getCommentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const comment = await CommentService.getCommentById(id);

        if (!comment) {
            return res.status(404).send("Comment not found.");
        }

        res.json(comment);
        
    } catch (err) {
        res.status(500).send("Error retrieving comment.");
    }
};
