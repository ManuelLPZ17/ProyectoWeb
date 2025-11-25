// BACKEND/middlewares/authReviewOwner.js

const ReviewService = require('../services/reviews_service');
const UserService = require('../services/users_service');

exports.authReviewOwnerMiddleware = async (req, res, next) => {
    const authHeader = req.headers['x-auth'];
    const reviewId = parseInt(req.params.id);

    if (!authHeader) {
        return res.status(401).send("Unauthorized: x-auth header is required.");
    }

    // 1. Obtener la review
    const review = await ReviewService.getReviewById(reviewId);

    if (!review) {
        return res.status(404).send("Review not found.");
    }

    // 2. Obtener al dueño REAL
    const userOwner = await UserService.getUserById(review.owner);

    if (!userOwner) {
        return res.status(500).send("Corrupted data: owner not found.");
    }

    // 3. Validar contraseña del dueño
    if (userOwner.password !== authHeader) {
        return res.status(401).send("Unauthorized: You are not the owner of this review.");
    }

    req.userId = userOwner.id; 
    next();
};
