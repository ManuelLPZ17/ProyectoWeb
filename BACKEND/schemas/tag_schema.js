// BACKEND/schemas/tag_schema.js

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, 
    
    name: { 
        type: String, 
        required: true, 
        unique: true, // Nombre de tag no puede repetirse
        trim: true
    },
    
    // Eliminamos el campo 'color'

    id_user: { 
        type: Number, 
        required: true 
    }
});

const TagMongooseModel = mongoose.model('Tag', tagSchema);
module.exports = TagMongooseModel;