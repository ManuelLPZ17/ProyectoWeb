// BACKEND/services/reviews_service.js

const ReviewModel = require('../schemas/review_schema');
const UserModel = require('../schemas/user_schema');

// Obtener siguiente ID consecutivo
async function getNextReviewId() {
    const last = await ReviewModel.find().sort({ id: -1 }).limit(1).exec();
    return last.length > 0 ? last[0].id + 1 : 1;
}

module.exports = {

    // CREATE
    async createReview(data) {
        const nextId = await getNextReviewId();

        const review = new ReviewModel({
            id: nextId,
            title: data.title,
            description: data.description || "",
            due_date: data.due_date,
            owner: data.owner,
            movie_id: data.movie_id,   // <-- AGREGADO
            status: 'A',
            tags: data.tags || [],
            rating: data.rating
        });

        return await review.save();
    },

    // READ: get review by ID
    async getReviewById(id) {
        const review = await ReviewModel.findOne({ id: parseInt(id) }).exec();
        if (!review) return null;

        const user = await UserModel.findOne({ id: review.owner }).exec();

        return {
            id: review.id,
            title: review.title,
            description: review.description,
            rating: review.rating,
            movie_id: review.movie_id,     // <-- AGREGADO
            owner: review.owner,
            owner_name: user?.name || null,
            due_date: review.due_date,
            status: review.status,
            tags: review.tags
        };
    },

    // READ: get reviews by user
    async getReviewsByUser(ownerId) {
        const reviews = await ReviewModel.find({ owner: parseInt(ownerId) }).exec();
        const user = await UserModel.findOne({ id: parseInt(ownerId) }).exec();

        return reviews.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            rating: r.rating,
            movie_id: r.movie_id,      // <-- AGREGADO
            owner: r.owner,
            owner_name: user?.name || null,
            due_date: r.due_date,
            status: r.status,
            tags: r.tags
        }));
    },

    // UPDATE
    async updateReview(id, updateFields) {

        if (updateFields.due_date) {
            updateFields.due_date = new Date(updateFields.due_date);
        }

        const updated = await ReviewModel.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: updateFields },
            { new: true }
        ).exec();

        if (!updated) return null;

        const user = await UserModel.findOne({ id: updated.owner }).exec();

        return {
            id: updated.id,
            title: updated.title,
            description: updated.description,
            rating: updated.rating,
            movie_id: updated.movie_id,     // <-- AGREGADO
            owner: updated.owner,
            owner_name: user?.name || null,
            due_date: updated.due_date,
            status: updated.status,
            tags: updated.tags
        };
    },

    // DELETE
    async deleteReview(id) {
        return ReviewModel.findOneAndDelete({ id: parseInt(id) }).exec();
    },

    // EXTRA: buscar reviews que contengan cierto tag
    async findReviewsByTagId(tagId) {
        const reviews = await ReviewModel.find({ tags: parseInt(tagId) }).exec();

        const result = [];

        for (const r of reviews) {
            const user = await UserModel.findOne({ id: r.owner }).exec();

            result.push({
                id: r.id,
                title: r.title,
                description: r.description,
                rating: r.rating,
                movie_id: r.movie_id,       // <-- AGREGADO
                owner: r.owner,
                owner_name: user?.name || null,
                due_date: r.due_date,
                status: r.status,
                tags: r.tags
            });
        }

        return result;
    },
    // GET ALL REVIEWS
    async getAllReviews() {
        const reviews = await ReviewModel.find().exec();

        const result = [];
        for (const r of reviews) {
            const user = await UserModel.findOne({ id: r.owner });

            result.push({
                id: r.id,
                title: r.title,
                description: r.description,
                rating: r.rating,
                movie_id: r.movie_id,
                owner: r.owner,
                owner_name: user?.name || null,
                due_date: r.due_date,
                status: r.status,
                tags: r.tags
            });
        }

        return result;
    }

    
};

