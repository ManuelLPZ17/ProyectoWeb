// BACKEND/services/comments_service.js

// SIMULACIÓN DE DATOS
let comments = []; 

exports.saveComment = async (commentObject) => {
    comments.push(commentObject.toObj());
    return commentObject.toObj();
};

exports.getCommentById = async (id) => {
    return comments.find(c => c.id === parseInt(id)) || null;
};

exports.getAllComments = async () => {
    return comments;
};

// Necesario para la validación de integridad: verificar si una reseña tiene comentarios
exports.findCommentsByReviewId = async (reviewId) => {
    return comments.filter(c => c.id_review === parseInt(reviewId));
};