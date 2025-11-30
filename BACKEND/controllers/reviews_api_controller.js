const ReviewService = require('../services/reviews_service');
const TagService = require('../services/tags_service');

// =======================
// 1. CREATE REVIEW
// =======================
exports.createReview = async (req, res) => {
    try {
        const owner = req.userId;  // viene del token
        const { title, description, due_date, tags = [], rating, movie_id } = req.body;

        // 🔥 movie_id ahora es OBLIGATORIO
        if (!title || !due_date || rating === undefined || movie_id === undefined) {
            return res.status(400).send("title, due_date, rating and movie_id are required");
        }

        // Validar que movie_id sea número positivo
        if (!Number.isInteger(Number(movie_id)) || Number(movie_id) <= 0) {
            return res.status(400).send("movie_id must be a positive integer (TMDb movie ID)");
        }

        // Validar tags (si vienen)
        for (const tagId of tags) {
            const tag = await TagService.getTagById(tagId);
            if (!tag) {
                return res.status(400).send(`Tag ${tagId} does not exist`);
            }
        }

        const newReview = await ReviewService.createReview({
            title,
            description,
            due_date,
            owner,
            movie_id,   // <-- 🔥 Se envía al servicio
            tags,
            rating
        });

        res.status(201).json(newReview);

    } catch (err) {
        console.error("❌ Error creating review:", err);
        res.status(500).send("Error creating review");
    }
};

// =======================
// 2. GET REVIEW BY ID
// =======================
exports.getReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const review = await ReviewService.getReviewById(id);

        if (!review) {
            return res.status(404).send("Review not found");
        }

        res.json(review);

    } catch (err) {
        console.error("❌ Error retrieving review:", err);
        res.status(500).send("Error retrieving review");
    }
};

// =======================
// 3. UPDATE REVIEW
// =======================
exports.updateReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updateFields = req.body;

        const review = await ReviewService.getReviewById(id);
        if (!review) {
            return res.status(404).send("Review not found");
        }

        // Validación de tags si se envían
        if (updateFields.tags) {
            for (const tagId of updateFields.tags) {
                const tag = await TagService.getTagById(tagId);
                if (!tag) {
                    return res.status(400).send(`Tag ${tagId} does not exist`);
                }
            }
        }

        // 🔥 Validación movie_id si viene en update
        if (updateFields.movie_id !== undefined) {
            if (!Number.isInteger(Number(updateFields.movie_id)) || Number(updateFields.movie_id) <= 0) {
                return res.status(400).send("movie_id must be a positive integer (TMDb movie ID)");
            }
        }

        // Actualiza usando Mongoose (NO usando la clase Review)
        const updatedReview = await ReviewService.updateReview(id, updateFields);

        res.json({
            message: "Review updated!",
            review: updatedReview
        });

    } catch (err) {
        console.error("❌ Update failed:", err);
        res.status(400).send("Update failed");
    }
};

// =======================
// 4. DELETE REVIEW
// =======================
exports.deleteReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Validar integridad: NO eliminar si tiene comentarios
        const CommentService = require('../services/comments_service');
        const comments = await CommentService.findCommentsByReviewId(id);

        if (comments && comments.length > 0) {
            return res.status(400).send("Cannot delete review. Review has assigned comments.");
        }

        const deletedReview = await ReviewService.deleteReview(id);

        if (!deletedReview) {
            return res.status(404).send("Review not found for deletion.");
        }

        res.json({
            message: `Review ${id} deleted!`,
            review: deletedReview
        });

    } catch (err) {
        console.error("❌ Error deleting review:", err);
        res.status(500).send("Error deleting review");
    }
};

// =======================
// 5. GET ALL REVIEWS BY USER
// =======================
exports.getAllReviewsByUser = async (req, res) => {
    try {
        const owner = req.userId;
        const reviews = await ReviewService.getReviewsByUser(owner);
        res.json(reviews);

    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).send("Error retrieving reviews");
    }
};

// =======================
// 6. GET ALL REVIEWS (admin/dev)
// =======================
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await ReviewService.getAllReviews();
        res.json(reviews);
    } catch (err) {
        console.error("❌ Error retrieving all reviews:", err);
        res.status(500).send("Error retrieving all reviews");
    }
};
exports.getReviewsByMovie = async (req, res) => {
    try {
        const { movieId } = req.query;

        if (!movieId) {
            return res.status(400).json({ error: "movieId es requerido" });
        }

        const reviews = await ReviewService.getReviewsByMovie(movieId);
        res.json(reviews);

    } catch (err) {
        console.error("Error en getReviewsByMovie:", err);
        res.status(500).json({ error: "Error obteniendo reseñas por película" });
    }
};

exports.checkUserReviewExists = async (req, res) => {
    try {
        const owner = req.userId;   // viene del authMiddleware
        const { movie_id } = req.query;

        if (!movie_id) {
            return res.status(400).json({ error: "movie_id es requerido" });
        }

        // Obtener todas las reseñas del usuario
        const reviews = await ReviewService.getReviewsByUser(owner);

        // Buscar coincidencia con movie_id
        const exists = reviews.some(r => r.movie_id == movie_id);

        res.json({ exists });

    } catch (err) {
        console.error("❌ Error en checkUserReviewExists:", err);
        res.status(500).json({ error: "Error verificando reseña" });
    }
};


