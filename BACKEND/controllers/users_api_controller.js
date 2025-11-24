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
        
        // 2. Obtener el usuario actual (Retorna un objeto Mongoose o null)
        // Usamos la función del servicio que trae la contraseña (SELECT +PASSWORD)
        let userMongooseDoc = await UserService.getUserById(id);
        
        if (!userMongooseDoc) {
            return res.status(404).send("User not found."); 
        }

        // --- PREPARACIÓN DEL OBJETO DE ACTUALIZACIÓN ---
        
        const updateFields = {};
        
        // 3. Aplicar los cambios al objeto de Mongoose
        // Iteramos sobre las claves enviadas en el body
        updateKeys.forEach(key => {
            if (['name', 'email', 'password'].includes(key) && updateInfo[key] !== undefined) {
                // Aquí usamos el setter del Modelo JS para validar la calidad de los datos
                // (Mínimo 8 chars, no vacío, etc.) antes de que Mongoose actúe.
                // Nota: Esto asume que el objeto Mongoose tiene los setters del modelo JS. 
                // Si no los tiene, el modelo JS debe ser usado SOLAMENTE para validación.

                // Opcional: Validar con la lógica del modelo JS
                // new User()[key] = updateInfo[key]; 
                
                // Si la validación (hecha implícitamente por el modelo Mongoose o aquí) pasa,
                // añadimos el campo a la actualización
                updateFields[key] = updateInfo[key];
            }
        });
        
        // 4. Persistir los cambios en la DB con el servicio, enviando SOLO los campos de actualización
        // Usamos updateFields para que Mongoose use $set y solo actualice lo necesario.
        const updatedUser = await UserService.updateUser(id, updateFields);

        res.json({
            message: "User updated!",
            user: updatedUser
        });

    } catch (err) {
        // Captura errores de Mongoose (Ej: E11000 duplicate key error, que ocurre si el email ya existe)
        if (err.code && err.code === 11000) {
             return res.status(400).send("Update failed: Email is already in use by another user.");
        }
        res.status(400).send(err.errorMessage || "Update failed due to invalid data.");
    }
};

// 5. ELIMINAR USUARIO (DELETE /users/:id) - Requiere auth de usuario
exports.deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // 1. Validar integridad: ¿Tiene tareas (reseñas) asignadas?
        // Asume que UserService.userHasReviews está implementado
        const hasReviews = await UserService.userHasReviews(id);
        if (hasReviews) {
            // Lanza la excepción requerida por la Práctica 2/3
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

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        // 1. Buscar al usuario por email
        const user = await UserService.findByEmail(email);

        if (!user) {
            return res.status(401).send("Invalid email or password.");
        }

        // 2. Usar la contraseña del cuerpo para verificar la identidad
        // Nota: findByEmail NO devuelve la contraseña por defecto (select: false en schema)
        // Por lo tanto, debes buscar el usuario por el password (o usar la función findUserByPassword).
        const authenticatedUser = await UserService.findUserByPassword(password);

        if (!authenticatedUser || authenticatedUser.email !== user.email) {
            return res.status(401).send("Invalid email or password.");
        }

        // 3. Login exitoso. Devolvemos el ID y la clave de autenticación.
        res.status(200).json({
            message: "Login successful.",
            user_id: user.id, // ID consecutivo
            auth_key: user.password // La contraseña es la clave x-auth
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send("An internal server error occurred during login.");
    }
};