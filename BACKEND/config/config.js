// BACKEND/config/config.js

// NOTA: En un proyecto real, DB_HOST se leería desde un archivo .env
const config = {
    // Reemplaza 'TU_CADENA_DE_CONEXION' con tu URL real de MongoDB Atlas
    DB_HOST: "mongodb+srv://admin:admin123@myapp.zw6q3rt.mongodb.net/CineclickDB",
    PORT: 3000,
    ADMIN_AUTH_KEY: "admin_auth_key_secreta" // Clave para autenticación de administrador
};

module.exports = config;