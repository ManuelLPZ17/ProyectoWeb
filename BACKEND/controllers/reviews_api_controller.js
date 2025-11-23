// BACKEND/controllers/reviews_api_controller.js

const { Review, ReviewException, getNextReviewID } = require('../models/review');
const ReviewService = require('../services/reviews_service'); 
const UserService = require('../services/users_service'); // Necesario para validar owner
const TagService = require('../services/tags_service');   // Necesario para validar tags

// 1. CREAR RESEÑA (POST /reviews)
exports.createReview = async (req, res) => {
    try {
        const { title, description, due_date, owner, tags, rating } = req.body;
        
        // Validar integridad: Owner debe existir
        const userExists = await UserService.getUserById(owner);
        if (!userExists) {
            return res.status(400).send("Owner ID does not exist.");
        }

        // Validar integridad: Todos los tags deben existir
        if (tags && Array.isArray(tags)) {
            for (const tagId of tags) {
                const tagExists = await TagService.getTagById(tagId);
                if (!tagExists) {
                    return res.status(400).send(`Tag ID ${tagId} does not exist.`);
                }
            }
        }
        
        const newReview = new Review(title, description, due_date, owner, tags, rating); 
        await ReviewService.saveReview(newReview); 

        res.status(201).json({ message: "Reseña creada con éxito.", review: newReview.toObj() }); 

    } catch (err) {
        res.status(400).send(err.errorMessage || "Error al crear la reseña. Datos inválidos.");
    }
};

// 2. OBTENER RESEÑA por ID (GET /reviews/:id)
exports.getReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const review = await ReviewService.getReviewById(id);

        if (!review) {
            return res.status(404).send("Review not found");
        }
        res.json(review); 
    } catch (err) {
        res.status(500).send("Error retrieving review details.");
    }
};

// 3. ACTUALIZAR RESEÑA (PATCH /reviews/:id)
exports.updateReview = async (req, res) => {
    const id = parseInt(req.params.id);
    const updateInfo = req.body;
    
    try {
        let review = await ReviewService.getReviewById(id);
        if (!review) { return res.status(404).send("Review not found."); }
        
        const currentReview = new Review(review.title, review.description, review.due_date, review.owner, review.tags, review.rating);
        
        // Aplicar cambios y usar setters para validación
        Object.keys(updateInfo).forEach(key => {
            if (currentReview[key] !== undefined) {
                currentReview[key] = updateInfo[key];
            }
        });
        
        await ReviewService.updateReview(id, currentReview);

        res.json({ message: "Review updated!", review: currentReview.toObj() });
    } catch (err) {
        res.status(400).send(err.errorMessage || "Update failed due to invalid data.");
    }
};

// 4. ELIMINAR RESEÑA (DELETE /reviews/:id)
exports.deleteReview = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // Validar integridad: NO eliminar si tiene COMENTARIOS asignados
        const CommentService = require('../services/comments_service');
        const hasComments = await CommentService.findCommentsByReviewId(id);
        if (hasComments && hasComments.length > 0) {
            return res.status(400).send("Cannot delete review. Review has assigned comments.");
        }

        const deletedReview = await ReviewService.deleteReview(id);

        if (!deletedReview) { return res.status(404).send("Review not found for deletion."); }

        res.json({ message: `Review with id ${id} deleted!`, review: deletedReview });
    } catch (err) {
        res.status(500).send("Error deleting review.");
    }
};

// 5. OBTENER TODAS las Reseñas de un Usuario (GET /reviews?page=X...)
exports.getAllReviewsByUser = async (req, res) => {
    // La autenticación (obtener ID de usuario) se maneja en el middleware/ruta.
    const userId = req.userId; // Asumiendo que el middleware de auth establece el userId
    
    // Lógica de paginación...
    res.status(501).send("Not Implemented Yet: getAllReviewsByUser (Paginación)");
};