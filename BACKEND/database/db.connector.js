// BACKEND/database/db.connector.js

const mongoose = require("mongoose");
const config = require("../config/config"); // Importa tu archivo de configuración

/**
 * Establece la conexión con MongoDB Atlas usando Mongoose.
 */
const dbConnect = async () => {
    try {
        await mongoose.connect(config.DB_HOST);
        //console.log("CONECTANDO A:", config.DB_HOST);

        console.log("✅ Conexión exitosa a MongoDB Atlas.");
    } catch (error) {
        console.error("❌ Error al conectarse a la base de datos:", error);
        // Puedes optar por salir de la aplicación si la conexión falla en el arranque
        // process.exit(1); 
    }
};

/**
 * Desconecta la conexión actual de Mongoose.
 */
const dbDisconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log("🔌 Desconectado de la base de datos.");
    } catch (error) {
        console.error("Error al desconectarse de la base de datos:", error);
    }
};

module.exports = { dbConnect, dbDisconnect };