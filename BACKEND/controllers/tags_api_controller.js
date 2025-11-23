// BACKEND/controllers/tags_api_controller.js

const { Tag, TagException } = require('../models/tag');
const TagService = require('../services/tags_service');
const ReviewService = require('../services/reviews_service'); // Para validar integridad (regla P3)

// 1. CREAR ETIQUETA (POST /tags)
exports.createTag = async (req, res) => {
    try {
        const { name, color } = req.body;
        // Asumiendo que id_user viene del middleware de autenticación (req.userId)
        const id_user = req.userId || 1; // Usamos '1' como fallback si no hay middleware de auth

        // 1. Validación de unicidad de nombre (similar a email)
        const tagExists = await TagService.findByName(name);
        if (tagExists) {
            return res.status(400).send("Tag name already in use.");
        }
        
        // 2. Crear el objeto Tag (Esto ejecuta las validaciones de los setters: nombre, color)
        const newTag = new Tag(name, color, id_user);
        
        // 3. Persistir en la DB (servicio)
        await TagService.saveTag(newTag);

        res.status(201).json({ message: "Tag created successfully.", tag: newTag.toObj() });
    } catch (err) {
        // Captura excepciones del modelo (ej. Color inválido, nombre vacío)
        res.status(400).send(err.errorMessage || "Error creating tag. Invalid data.");
    }
};

// 2. OBTENER ETIQUETA por ID (GET /tags/:id)
exports.getTagById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tag = await TagService.getTagById(id);

        if (!tag) {
            return res.status(404).send("Tag not found.");
        }
        res.json(tag); 
    } catch (err) {
        res.status(500).send("Error retrieving tag details.");
    }
};

// 3. OBTENER TODAS las Etiquetas de un Usuario (GET /tags?page=X...)
exports.getAllTagsByUser = async (req, res) => {
    // Aquí se requiere la autenticación para obtener el ID del usuario (req.userId)
    // Lógica de paginación...
    res.status(501).send("Not Implemented Yet: getAllTagsByUser (Paginación)");
};

// 4. ACTUALIZAR ETIQUETA (PATCH /tags/:id)
exports.updateTag = async (req, res) => {
    const id = parseInt(req.params.id);
    const updateInfo = req.body;
    const updateKeys = Object.keys(updateInfo);
    
    try {
        let tag = await TagService.getTagById(id);
        if (!tag) { return res.status(404).send("Tag not found."); }
        
        // 1. Crear instancia del Modelo para usar setters y validación
        const currentTag = new Tag(tag.name, tag.color, tag.id_user);
        
        let updatedCount = 0;
        
        // 2. Aplicar solo los campos permitidos (name y color)
        updateKeys.forEach(key => {
            if (['name', 'color'].includes(key) && updateInfo[key] !== undefined) {
                currentTag[key] = updateInfo[key];
                updatedCount++;
            }
        });
        
        // 3. Si no se actualizó nada
        if (updatedCount === 0) {
            throw new TagException("No valid fields provided for update (only name and color are allowed).");
        }
        
        // 4. Persistir los cambios
        await TagService.updateTag(id, currentTag);

        res.json({ message: "Tag updated!", tag: currentTag.toObj() });
    } catch (err) {
        res.status(400).send(err.errorMessage || "Update failed due to invalid data.");
    }
};

// 5. ELIMINAR ETIQUETA (DELETE /tags/:id)
exports.deleteTag = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // 1. Validar integridad: ¿La etiqueta está en alguna reseña?
        // (Requisito de la práctica 2: Indicar a qué tareas están asignadas)
        const reviews = await ReviewService.findReviewsByTagId(id);
        if (reviews && reviews.length > 0) {
            const reviewIds = reviews.map(r => r.id).join(', ');
            return res.status(400).send(`Cannot delete Tag. Used in Reviews: ${reviewIds}`);
        }

        // 2. Eliminar de la DB
        const deletedTag = await TagService.deleteTag(id);

        if (!deletedTag) { return res.status(404).send("Tag not found for deletion."); }

        res.json({ message: `Tag with id ${id} deleted!`, tag: deletedTag });
    } catch (err) {
        res.status(500).send("Error deleting tag.");
    }
};