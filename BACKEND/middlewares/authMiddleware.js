// BACKEND/middlewares/authMiddleware.js

const UserService = require('../services/users_service');
const config = require('../config/config');

// Middleware 1: Autenticación del Propietario (CRUD de recursos específicos /:id)
// Verifica que la contraseña del 'x-auth' coincida con la del dueño del recurso.
exports.authOwnerMiddleware = async (req, res, next) => {
    const authHeader = req.headers['x-auth'];
    
    // El ID del recurso a acceder/modificar puede venir de req.params.id (GET/DELETE) 
    // o de req.body.owner/id_user (POST/PATCH). Usamos req.params.id para simplificar la búsqueda.
    const userIdToAccess = parseInt(req.params.id); 

    if (!authHeader) {
        return res.status(401).send("Unauthorized: Authentication header 'x-auth' required.");
    }
    
    // Buscar al usuario cuyo ID está siendo consultado/modificado
    const user = await UserService.getUserById(userIdToAccess);

    if (!user) {
        return res.status(404).send("User not found.");
    }

    // Validar Contraseña
    if (user.password !== authHeader) {
        return res.status(401).send("Unauthorized: Invalid password for this user.");
    }

    req.userId = user.id; // Adjuntamos el ID del usuario al request para el controlador
    next();
};

// Middleware 2: Autenticación de Acceso General (Para /home.html, /tasks.html)
// Verifica que exista CUALQUIER usuario con esa contraseña.
exports.authRequiredMiddleware = async (req, res, next) => {
    const authHeader = req.headers['x-auth'];
    
    if (!authHeader) {
        // Regresa 401 si no hay header de autenticación [cite: 138]
        return res.status(401).send("Unauthorized: Authentication required to access this page.");
    }
    
    // Busca cualquier usuario que tenga esa contraseña
    const user = await UserService.findUserByPassword(authHeader);
    
    if (!user) {
        return res.status(401).send("Unauthorized: Invalid authentication header.");
    }
    
    req.userId = user.id; 
    req.user = user;
    next();
};

// Middleware 3: Autenticación de Administrador (GET /users)
// Verifica que la clave de autenticación sea 'admin auth'[cite: 226].
exports.authAdminMiddleware = (req, res, next) => {
    const authHeader = req.headers['x-auth'];
    
    if (authHeader !== config.ADMIN_AUTH_KEY) {
        // Regresa 401 si la clave no es la de administrador
        return res.status(401).send("Unauthorized: Admin access key required.");
    }
    next();
};

