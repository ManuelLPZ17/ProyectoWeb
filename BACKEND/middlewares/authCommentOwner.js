const CommentService = require('../services/comments_service');
const UserService = require('../services/users_service');

exports.authCommentOwnerMiddleware = async (req, res, next) => {
    const authHeader = req.headers['x-auth'];
    const commentId = parseInt(req.params.id);

    if (!authHeader) {
        return res.status(401).send("Unauthorized: x-auth header is required.");
    }

    // Obtener el comentario
    const comment = await CommentService.getCommentById(commentId);

    if (!comment) {
        return res.status(404).send("Comment not found.");
    }

    // Obtener el dueño REAL del comment
    const userOwner = await UserService.getUserById(comment.id_user);

    if (!userOwner) {
        return res.status(500).send("Corrupted data: User owner not found.");
    }

    // Validar contraseña del dueño REAL
    if (userOwner.password !== authHeader) {
        return res.status(401).send("Unauthorized: You are not the owner of this comment.");
    }

    req.userId = userOwner.id; // Por si el controlador lo necesita
    next();
};
