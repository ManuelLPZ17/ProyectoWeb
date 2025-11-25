// BACKEND/models/comment.js
const mongoose = require('mongoose');

// Definimos el esquema de los comentarios
const commentSchema = new mongoose.Schema({
    id_review: { type: Number, required: true },
    movie_id: { type: Number, required: true },
    owner: { type: Number, required: true },
    owner_name: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// Creamos el modelo "Comment" basado en el esquema
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
