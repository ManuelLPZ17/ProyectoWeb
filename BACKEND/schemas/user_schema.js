// BACKEND/schemas/user_schema.js

const mongoose = require('mongoose');

// Definición de las reglas de Mongoose para el modelo User
const userSchema = new mongoose.Schema({
    // NOTA: MongoDB genera automáticamente un ID único (_id).
    
    // Campo para almacenar el ID consecutivo de tu modelo JS (user.js)
    id: { 
        type: Number, 
        required: true, 
        unique: true,
        // Usamos este campo 'id' para simular el autogenerado de tu modelo JS.
    }, 

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio y no puede estar vacío.'],
        trim: true,
    },
    
    email: {
        type: String,
        required: [true, 'El email es obligatorio.'],
        unique: true, // Regla: NO se puede repetir entre usuarios
        trim: true,
        lowercase: true,
    },
    
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres.'], // Regla: Mínimo 8 caracteres
        select: false, // Ocultar la contraseña por defecto en las consultas GET
    },
    
    joined_at: {
        type: Date,
        default: Date.now, 
        immutable: true, // Regla: NO debe poderse modificar una vez generado
    },

    // Puedes añadir otros campos necesarios de tu modelo JS aquí si los necesitas
    // Ej: status: { type: String, enum: ['active', 'inactive'], default: 'active' },

}, { 
    // Opciones del esquema
    timestamps: false // No añade campos createdAt y updatedAt automáticos si ya tienes joined_at
});

// Creamos y exportamos el modelo de Mongoose
const UserMongooseModel = mongoose.model('User', userSchema);
module.exports = UserMongooseModel;