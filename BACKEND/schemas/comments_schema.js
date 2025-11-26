// BACKEND/schemas/comments_schema.js

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    id_review: { type: Number, required: true },
    movie_id: { type: Number, required: true },
    owner: { type: Number, required: true },
    owner_name: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: String, required: true }
});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;