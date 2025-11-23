// BACKEND/services/users_service.js

// NOTA: En la práctica final, aquí importarías el esquema de Mongoose,
// pero por ahora, solo simularemos la estructura.

const { User } = require('../models/user'); // Se importa la clase User del modelo
// const ReviewService = require('./tasks_service'); // Se necesitará para la validación de integridad

// --- SIMULACIÓN DE LA BASE DE DATOS (Para que los controladores puedan iniciar) ---

// Arreglo temporal para simular el almacenamiento de datos antes de usar Mongoose
let users = []; 
let currentId = 1;

// Función que simula la lectura de la base de datos (retorna el array)
const readDB = () => {
    // En la Práctica 3 original, esto leería el archivo users.json.
    // Aquí, simplemente devolvemos la simulación.
    return users;
};

// --- FUNCIONES CRUD DEL SERVICIO ---

/**
 * Simula el guardado de un nuevo usuario en la base de datos.
 * En Mongoose: const newUser = new UserMongooseModel(userObject); return newUser.save();
 * @param {User} userObject - Objeto User validado por el modelo.
 * @returns {Object} El objeto guardado.
 */
exports.saveUser = async (userObject) => {
    // Simulación: Asignar ID si es necesario y guardar en el array
    // userObject.id = currentId++; // Ya lo maneja getNextUserID en el modelo
    users.push(userObject.toObj());
    return userObject.toObj();
};

/**
 * Busca un usuario por su ID.
 * En Mongoose: return UserMongooseModel.findById(id).exec();
 * @param {number} id - ID del usuario.
 * @returns {Object|null} Objeto usuario o null.
 */
exports.getUserById = async (id) => {
    return users.find(user => user.id === parseInt(id)) || null;
};

/**
 * Busca un usuario por su correo electrónico (usado para validar duplicados).
 * En Mongoose: return UserMongooseModel.findOne({ email: email }).exec();
 * @param {string} email - Correo a buscar.
 * @returns {Object|null} Objeto usuario o null.
 */
exports.findByEmail = async (email) => {
    return users.find(user => user.email === email) || null;
};

/**
 * Obtiene todos los usuarios. Usado para paginación (GET /users).
 */
exports.getAllUsers = async () => {
    return users;
};

/**
 * Actualiza la información de un usuario existente.
 * En Mongoose: return UserMongooseModel.findByIdAndUpdate(id, userObject, {...}).exec();
 */
exports.updateUser = async (id, userObject) => {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
        users[index] = userObject.toObj();
        return users[index];
    }
    return null;
};

/**
 * Elimina un usuario por su ID.
 * En Mongoose: return UserMongooseModel.findByIdAndDelete(id).exec();
 */
exports.deleteUser = async (id) => {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
        const deletedUser = users[index];
        users.splice(index, 1);
        return deletedUser;
    }
    return null;
};

/**
 * Valida si el usuario tiene reseñas asignadas (Requisito de integridad para la eliminación).
 * NOTA: Esto debe usar el servicio de Reseñas (TaskService).
 */
exports.userHasReviews = async (userId) => {
    // const reviews = await ReviewService.getAllReviews();
    // return reviews.some(review => review.owner === parseInt(userId));
    return false; // Simulación: siempre devuelve false por ahora
};

// En BACKEND/services/users_service.js (Añadir esta función)

/**
 * Busca un usuario por su contraseña (usado para autenticación general).
 * @param {string} password - Contraseña a buscar.
 * @returns {Object|null} Objeto usuario o null.
 */
exports.findUserByPassword = async (password) => {
    // Implementación usando tu array simulado (o Mongoose en la versión final)
    const users = this.getAllUsers(); // Asumiendo que esta función existe en el servicio
    return users.find(user => user.password === password) || null;
};