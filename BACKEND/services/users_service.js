// BACKEND/services/users_service.js

const UserMongooseModel = require('../schemas/user_schema'); 
const { User } = require('../models/user'); // Se usa para la validación JS inicial
const ReviewService = require('./reviews_service'); // Para validar integridad (Requisito delete)


// 1. GUARDAR un nuevo usuario (POST /users)
exports.saveUser = async (userJSObject) => {
    // 1. Crea el objeto Mongoose a partir del modelo JS
    const newUser = new UserMongooseModel(userJSObject.toObj());
    
    // 2. Ejecuta la validación de Mongoose y guarda en la DB
    return newUser.save(); 
};

// 2. BUSCAR por Email (Para validar duplicados)
exports.findByEmail = async (email) => {
    return UserMongooseModel.findOne({ email: email }).exec();
};

// 3. OBTENER por ID (GET /users/:id)
exports.findUserByPassword = async (password) => {
    // Usamos select('+password') para forzar a Mongoose a devolver el campo 'password'
    // que fue ocultado en el esquema. 
    return UserMongooseModel.findOne({ password: password })
                           .select('+password') 
                           .exec(); 
};

// --- FUNCIÓN CRÍTICA PARA CONSULTA INDIVIDUAL ---
exports.getUserById = async (id) => {
    // Usamos select('+password') aquí también para que el controlador tenga acceso a ella
    // para las comparaciones.
    return UserMongooseModel.findOne({ id: parseInt(id) }).select('+password').exec(); 
};

// --- FUNCIONES CRUD RESTANTES ---

// 5. OBTENER TODOS los Usuarios (Usado para paginación GET /users)
exports.getAllUsers = async () => {
    // Mongoose.find() sin filtros trae todos.
    return UserMongooseModel.find({}).exec(); 
};

// 6. ACTUALIZAR Usuario (PATCH /users/:id)
exports.updateUser = async (id, updateFields) => { // Recibe SOLO los campos a modificar
    // El método findOneAndUpdate busca por el campo 'id' (el consecutivo JS)
    return UserMongooseModel.findOneAndUpdate(
        { id: parseInt(id) }, 
        { $set: updateFields }, // <--- CLAVE: USAMOS $SET y solo los campos modificados
        { 
            new: true,           // Devuelve el objeto actualizado
            runValidators: true, // Ejecuta las validaciones del esquema (Ej. minlength, unique)
        }
    ).exec();
};

// 7. ELIMINAR Usuario (DELETE /users/:id)
exports.deleteUser = async (id) => {
    // Busca y elimina el documento por el campo 'id' numérico
    return UserMongooseModel.findOneAndDelete({ id: parseInt(id) }).exec();
};


exports.userHasReviews = async (userId) => {
    try {
        // La llamada a findReviewsByOwner está correcta
        const reviews = await ReviewService.findReviewsByOwner(parseInt(userId));
        
        // Verificamos si el resultado es un array con elementos
        return Array.isArray(reviews) && reviews.length > 0;
    } catch (e) {
        // Capturamos el error de forma segura
        console.error("Error al verificar integridad de reseñas:", e.message);
        return false; 
    }
};