// BACKEND/controllers/tags_api_controller.js

const TagService = require('../services/tags_service');
const ReviewService = require('../services/reviews_service');

// ===============================================================
// 1. CREAR ETIQUETA (POST /tags)
// ===============================================================
exports.createTag = async (req, res) => {
    try {
        const userId = req.userId;

        if (!req.body.name) {
            return res.status(400).send("Tag name is required.");
        }

        if (!req.body.movie_id) {
            return res.status(400).send("movie_id is required.");
        }
        const tag = await TagService.createTag({
            name: req.body.name,
            id_user: userId,
            movie_id: req.body.movie_id
        });

        res.status(201).send(tag);

    } catch (err) {
        console.error("❌ Error creating tag:", err);
        res.status(400).send(err.message || "Error creating tag.");
    }
};


// ===============================================================
// 2. OBTENER ETIQUETA POR ID (GET /tags/:id)
// ===============================================================
exports.getTagById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const tag = await TagService.getTagById(id);
        if (!tag) {
            return res.status(404).send("Tag not found.");
        }

        res.json(tag);

    } catch (err) {
        console.error("❌ Error retrieving tag:", err);
        res.status(500).send("Error retrieving tag.");
    }
};


// ===============================================================
// 3. LISTAR TAGS POR PELÍCULA (GET /tags?movie_id=...)
exports.getTagsByMovie = async (req, res) => {
    try {
        const movieId = req.query.movie_id;
        if (!movieId) return res.status(400).send("movie_id is required");
        const tags = await TagService.getTagsByMovie(movieId);
        res.json(tags);
    } catch (err) {
        console.error("❌ Error retrieving tags:", err);
        res.status(500).send("Error retrieving tags.");
    }
};


// ===============================================================
// 4. ACTUALIZAR ETIQUETA (PATCH /tags/:id)
// ===============================================================
exports.updateTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const newName = req.body.name;

        if (!newName) {
            return res.status(400).send("Only 'name' can be updated.");
        }

        const tag = await TagService.getTagById(id);

        if (!tag) {
            return res.status(404).send("Tag not found.");
        }

        const updatedTag = await TagService.updateTag(id, { name: newName });

        res.json({
            message: "Tag updated!",
            tag: updatedTag
        });

    } catch (err) {
        console.error("❌ Error updating tag:", err);
        res.status(500).send("Error updating tag.");
    }
};


// ===============================================================
// 5. ELIMINAR ETIQUETA (DELETE /tags/:id)
// ===============================================================
exports.deleteTag = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Validación: ¿Está usada en una review?
        const reviews = await ReviewService.findReviewsByTagId(id);

        if (reviews.length > 0) {
            const ids = reviews.map(r => r.id).join(", ");
            return res.status(400).send(`Cannot delete Tag. Used in Reviews: ${ids}`);
        }

        const deleted = await TagService.deleteTag(id);

        if (!deleted) {
            return res.status(404).send("Tag not found.");
        }

        res.json({
            message: `Tag with id ${id} deleted!`,
            tag: deleted
        });

    } catch (err) {
        console.error("❌ Error deleting tag:", err);
        res.status(500).send("Error deleting tag.");
    }
};

