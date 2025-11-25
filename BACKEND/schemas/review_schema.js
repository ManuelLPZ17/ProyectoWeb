// BACKEND/schemas/review_schema.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    due_date: {
        type: Date,
        required: true
    },

    owner: {
        type: Number,
        required: true
    },

    movie_id: {                // <-- AGREGADO
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['A', 'F', 'C'],
        default: 'A'
    },

    tags: {
        type: [Number],    // Array de IDs de Tag
        default: []
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
});

const ReviewModel = mongoose.model('Review', reviewSchema);
module.exports = ReviewModel;
