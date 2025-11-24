// BACKEND/controllers/auth_controller.js

const UserService = require('../services/users_service');

/**
 * Maneja la lógica de inicio de sesión (Login).
 * Ruta: POST /auth/login
 */
exports.loginUser = async (req, res) => {
    // La lógica real para buscar y autenticar al usuario va aquí.
    // Por ahora, solo devolvemos un placeholder funcional.
    res.status(501).send("Not Implemented: Login Logic");
};

/**
 * Maneja la obtención del perfil del usuario autenticado.
 * Ruta: GET /auth/me
 */
exports.getAuthenticatedUser = async (req, res) => {
    // Si el middleware de autenticación fue exitoso, req.user contiene los datos.
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).send("Unauthorized");
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("Email and password are required.");

        const user = await UserService.findByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).send("Invalid email or password.");
        }

        // Login exitoso
        res.status(200).json({
            message: "Login successful",
            user_id: user.id,
            auth_key: user.password
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error during login.");
    }
};
