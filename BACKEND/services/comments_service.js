// BACKEND/services/comments_service.js

const CommentMongooseModel = require('../schemas/comments_schema');


const Comment = require('../models/comment');

exports.getCommentsByUser = async (userId) => {
    return await Comment.find({ userId: userId }).sort({ createdAt: -1 }); // opcional: ordenar por fecha
};


exports.saveComment = async (commentObj) => {
    const newComment = new CommentMongooseModel(commentObj);
    return newComment.save();
};

exports.findCommentsByReviewId = async (reviewId) => {
    return CommentMongooseModel.find({ id_review: reviewId }).exec();
};

exports.getCommentById = async (id) => {
    return CommentMongooseModel.findOne({ id }).exec();
};

exports.updateComment = async (id, updateData) => {
    return CommentMongooseModel.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
    ).exec();
};

exports.deleteComment = async (id) => {
    return CommentMongooseModel.findOneAndDelete({ id }).exec();
};