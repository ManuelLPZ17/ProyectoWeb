// BACKEND/routes/users.js

const express = require('express');
const usersController = require('../controllers/users_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerUsers = express.Router();

// RUTA: POST /users
// Regla: Crea un nuevo usuario (Registro). No requiere autenticación. [cite: 214]
routerUsers.post('/', usersController.registerUser);

// RUTA: GET /users
// Regla: Consulta paginada (admin access required: "admin auth"). [cite: 219, 222]
routerUsers.get('/', authMiddleware.authAdminMiddleware, usersController.getAllUsers);

// --- Aplicar Middleware de Propietario a las rutas que usan el ID ---
// Aplica a: GET /users/:id, PATCH /users/:id, DELETE /users/:id
routerUsers.use('/:id', authMiddleware.authOwnerMiddleware); 

// RUTA: GET /users/:id
// Regla: Consulta un usuario específico. Requiere autenticación del propietario. [cite: 264]
routerUsers.get('/:id', usersController.getUserById);

// RUTA: PATCH /users/:id
// Regla: Actualiza un usuario. Requiere autenticación del propietario. [cite: 281]
routerUsers.patch('/:id', usersController.updateUser);

// RUTA: DELETE /users/:id
// Regla: Elimina un usuario. Requiere autenticación del propietario y validación de integridad. [cite: 292]
routerUsers.delete('/:id', usersController.deleteUser);

module.exports = routerUsers;