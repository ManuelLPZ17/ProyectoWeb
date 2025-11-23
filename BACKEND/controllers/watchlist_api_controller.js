// BACKEND/controllers/watchlist_api_controller.js

const { Watchlist, WatchlistException } = require('../models/watchlist');
const WatchlistService = require('../services/watchlist_service'); 
const UserService = require('../services/users_service'); // Para validar al usuario


// 1. AGREGAR A WATCHLIST (POST /watchlist)
exports.addItemToWatchlist = async (req, res) => {
    try {
        const { id_movie } = req.body;
        // Asumiendo que id_user viene del middleware de autenticación
        const id_user = req.userId || 1; // Usamos '1' como fallback si no hay auth

        // 1. Validar integridad: El usuario debe existir
        const userExists = await UserService.getUserById(id_user);
        if (!userExists) {
            return res.status(400).send("Error: User ID does not exist.");
        }
        
        // 2. Validar integridad: No puede haber duplicados (mismo usuario/misma película)
        const isDuplicate = await WatchlistService.isMovieInWatchlist(id_user, id_movie);
        if (isDuplicate) {
            return res.status(400).send("This movie is already in your watchlist.");
        }

        // 3. Crear el objeto Watchlist (Esto ejecuta las validaciones del modelo)
        const newItem = new Watchlist(id_user, id_movie);
        
        // 4. Persistir en la DB (servicio)
        await WatchlistService.saveWatchlistItem(newItem);

        res.status(201).json({ 
            message: "Movie added to watchlist successfully.", 
            item: newItem.toObj() 
        });
        
    } catch (err) {
        // Captura excepciones del modelo (ej. id_movie vacío)
        res.status(400).send(err.errorMessage || "Error adding item to watchlist. Invalid data.");
    }
};

// 2. OBTENER WATCHLIST POR USUARIO (GET /watchlist)
exports.getWatchlist = async (req, res) => {
    try {
        const id_user = req.userId || 1; // Asumiendo que el ID del usuario viene de la autenticación
        
        // Nota: La paginación (page/limit) se implementaría aquí si fuera necesario
        const items = await WatchlistService.findItemsByUserId(id_user);

        if (items.length === 0) {
            return res.status(200).json({ message: "Your watchlist is empty.", data: [] });
        }

        res.json({ message: "Watchlist retrieved successfully.", data: items });
    } catch (err) {
        res.status(500).send("Error retrieving watchlist.");
    }
};

// 3. ELIMINAR DE WATCHLIST (DELETE /watchlist/:id)
exports.deleteWatchlistItem = async (req, res) => {
    const itemId = parseInt(req.params.id);
    const id_user = req.userId || 1; // Usuario autenticado

    try {
        // 1. Buscar el elemento y validar su existencia
        const itemToDelete = await WatchlistService.getWatchlistItemById(itemId);

        if (!itemToDelete) {
            return res.status(404).send("Watchlist item not found.");
        }
        
        // 2. Validar que el usuario autenticado sea el propietario del elemento
        if (itemToDelete.id_user !== id_user) {
            // Esto es crucial para la seguridad: 403 Forbidden o 401 Unauthorized
            return res.status(403).send("Forbidden: You do not own this watchlist item.");
        }

        // 3. Eliminar de la DB
        const deletedItem = await WatchlistService.deleteWatchlistItem(itemId);

        res.json({ message: `Watchlist item with id ${itemId} deleted!`, item: deletedItem });
    } catch (err) {
        res.status(500).send("Error deleting watchlist item.");
    }
};

// 4. ACTUALIZAR WATCHLIST (PATCH /watchlist/:id) - Menos común en watchlists simples, pero necesario para el CRUD
exports.updateWatchlistItem = async (req, res) => {
    // La actualización de watchlist (PATCH) solo se usaría para modificar metadatos como "visto", 
    // pero como el modelo es simple, lo dejamos como no implementado.
    res.status(501).send("Not Implemented Yet: Update Watchlist Item");
};