// BACKEND/services/comments_service.js

// SIMULACIÓN DE DATOS
const CommentMongooseModel = require('../schemas/comments_schema');

exports.saveComment = async (commentJS) => {
    const newComment = new CommentMongooseModel(commentJS.toObj());
    return newComment.save();
};

exports.findCommentsByReviewId = async (reviewId) => {
    return CommentMongooseModel.find({ id_review: reviewId }).exec();
};

exports.getCommentById = async (id) => {
    return CommentMongooseModel.findOne({ id: parseInt(id) }).exec();
};

exports.updateComment = async (id, updateData) => {
    return CommentMongooseModel.findOneAndUpdate(
        { id: parseInt(id) },
        updateData,
        { new: true } // devuelve el actualizado
    ).exec();
};

exports.deleteComment = async (id) => {
    return CommentMongooseModel.findOneAndDelete({ id: parseInt(id) }).exec();
};
