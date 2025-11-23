// BACKEND/controllers/users_api_controller.js

const { User, UserException } = require('../models/user');
// Asume que esta importación es real y que UserService tiene las funciones asíncronas
const UserService = require('../services/users_service'); 
const config = require('../config/config');

// 1. REGISTRAR USUARIO (POST /users)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        // 1. Validar Contraseñas Coincidentes (Requisito de la práctica)
        if (password !== confirm_password) {
            return res.status(400).send("Passwords Missmatch");
        }
        
        // 2. Validar Email Duplicado (Validación inter-modelo en el controlador)
        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
            return res.status(400).send("Email already in use.");
        }

        // 3. Crear el objeto User (Esto ejecuta las validaciones de los setters)
        const newUser = new User(name, email, password); 
        
        // 4. Guardar el usuario en la DB (servicio)
        await UserService.saveUser(newUser); 

        // 201 Created (Éxito)
        res.status(201).json({ 
            message: "Usuario registrado con éxito.",
            user: newUser.toObj()
        }); 

    } catch (err) {
        // Captura excepciones del modelo (Contraseña corta, nombre vacío, etc.)
        res.status(400).send(err.errorMessage || "Error al crear usuario. Datos inválidos.");
    }
};

// 2. OBTENER TODOS los Usuarios (GET /users?page=X&limit=Y) - Requiere admin_auth
exports.getAllUsers = async (req, res) => {
    // 1. Validación de Autenticación de Administrador
    const authHeader = req.headers['x-auth'];
    if (authHeader !== config.ADMIN_AUTH_KEY) {
        return res.status(401).send("Unauthorized: Admin access required.");
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const allUsers = await UserService.getAllUsers();
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const paginatedUsers = allUsers.slice(startIndex, endIndex);

        // 2. Construcción de la respuesta JSON paginada
        res.json({
            page: page,
            next_page: endIndex < allUsers.length ? page + 1 : null,
            limit: limit,
            total: allUsers.length,
            data: paginatedUsers
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users.");
    }
};

// 3. OBTENER USUARIO por ID (GET /users/:id) - Requiere auth de usuario
exports.getUserById = async (req, res) => {
    // La autenticación (contraseña coincidente) se maneja en el Middleware que debe ir antes de esta función
    try {
        const id = parseInt(req.params.id);
        const user = await UserService.getUserById(id);

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user); // 200 OK
        
    } catch (err) {
        res.status(500).send("Error retrieving user details.");
    }
};

// 4. ACTUALIZAR USUARIO (PATCH /users/:id) - Requiere auth de usuario
exports.updateUser = async (req, res) => {
    // La autenticación ya se manejó en el middleware.
    const id = parseInt(req.params.id);
    const updateInfo = req.body;
    const updateKeys = Object.keys(updateInfo);
    
    try {
        // 1. Verificar que se envíe al menos un campo
        if (updateKeys.length === 0) {
            return res.status(400).send("Must provide at least one field to update (name, email, or password).");
        }
        
        // 2. Obtener el usuario actual para aplicar los cambios
        let user = await UserService.getUserById(id);
        if (!user) {
            return res.status(404).send("User not found.");
        }
        
        // 3. Aplicar los cambios y usar el modelo para validar (sin modificar ID o joined_at)
        updateKeys.forEach(key => {
            if (['name', 'email', 'password'].includes(key)) {
                // Si la clave existe y no es joined_at o id, usa el setter del modelo para validar
                user[key] = updateInfo[key];
            }
        });
        
        // 4. Persistir los cambios en la DB
        await UserService.updateUser(id, user);

        res.json({
            message: "User updated!",
            user: user
        });

    } catch (err) {
        // Captura excepciones de validación (ej. email duplicado, contraseña corta)
        res.status(400).send(err.errorMessage || "Update failed due to invalid data.");
    }
};

// 5. ELIMINAR USUARIO (DELETE /users/:id) - Requiere auth de usuario
exports.deleteUser = async (req, res) => {
    // La autenticación ya se manejó en el middleware.
    const id = parseInt(req.params.id);

    try {
        // 1. Validar integridad: ¿Tiene tareas (reseñas) asignadas?
        const hasReviews = await UserService.userHasReviews(id);
        if (hasReviews) {
            return res.status(400).send("Cannot delete user. User has assigned reviews.");
        }

        // 2. Eliminar de la DB
        const deletedUser = await UserService.deleteUser(id);

        if (!deletedUser) {
            return res.status(404).send("User not found for deletion.");
        }

        // 200 OK
        res.json({
            message: `User with id ${id} deleted!`,
            user: deletedUser
        });

    } catch (err) {
        res.status(500).send("Error deleting user.");
    }
};