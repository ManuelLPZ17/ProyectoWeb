// BACKEND/routes/tags.js

const express = require('express');
const tagsController = require('../controllers/tags_api_controller');
const authMiddleware = require('../middlewares/authMiddleware');

const routerTags = express.Router();

// POST /tags: Crea una nueva etiqueta (Requiere autenticación)
routerTags.post('/', authMiddleware.authRequiredMiddleware, tagsController.createTag);

// GET /tags: Obtener tags por película (movie_id)
routerTags.get('/', tagsController.getTagsByMovie);

// DELETE /tags/:id (Requiere autenticación del propietario y validación de integridad)
routerTags.delete('/:id', authMiddleware.authOwnerMiddleware, tagsController.deleteTag);

// GET /tags/:id
routerTags.get('/:id', tagsController.getTagById);

// PATCH /tags/:id (Requiere autenticación del propietario)
routerTags.patch('/:id', authMiddleware.authOwnerMiddleware, tagsController.updateTag);

module.exports = routerTags;