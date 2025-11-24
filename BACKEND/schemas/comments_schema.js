const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    id_review: {
        type: Number,
        required: true
    },
    id_user: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;
