// BACKEND/schemas/review_schema.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // ID numérico consecutivo de tu modelo JS
    id: { 
        type: Number, 
        required: true, 
        unique: true 
    }, 
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: false 
    },
    due_date: { 
        type: Date, 
        required: true 
    },
    // Referencia al usuario propietario de la reseña
    owner: { 
        type: Number, 
        required: true 
    }, 
    status: { 
        type: String, 
        enum: ['A', 'F', 'C'], 
        default: 'A' 
    },
    tags: { 
        type: [Number], 
        required: false 
    }, // Array de IDs de etiquetas
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 10 
    },
});

const ReviewMongooseModel = mongoose.model('Review', reviewSchema);
module.exports = ReviewMongooseModel;