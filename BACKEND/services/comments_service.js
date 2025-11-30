// BACKEND/services/comments_service.js

const CommentMongooseModel = require('../schemas/comments_schema');

exports.saveComment = async (commentObj) => {
    const newComment = new CommentMongooseModel(commentObj);
    return newComment.save();
};

exports.findCommentsByReviewId = async (reviewId) => {
    return CommentMongooseModel.find({ id_review: reviewId }).exec();
};

exports.findCommentsByUserId = async (userId) => {
    return CommentMongooseModel.find({ owner: userId }).exec();
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

exports.getLastComment = async () => {
    return CommentMongooseModel.findOne().sort({ id: -1 }).exec();
};
