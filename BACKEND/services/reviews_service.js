// BACKEND/services/reviews_service.js

const ReviewModel = require('../schemas/review_schema');

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
            status: 'A',
            tags: data.tags || [],
            rating: data.rating
        });

        return await review.save();
    },

    // READ: get review by ID
    async getReviewById(id) {
        return ReviewModel.findOne({ id: parseInt(id) }).exec();
    },

    // READ: get reviews by user
    async getReviewsByUser(ownerId) {
        return ReviewModel.find({ owner: parseInt(ownerId) }).exec();
    },

    // UPDATE
    async updateReview(id, updateFields) {

        // Si viene due_date, Mongoose debe convertirla a Date
        if (updateFields.due_date) {
            updateFields.due_date = new Date(updateFields.due_date);
        }

        return ReviewModel.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: updateFields },
            { new: true }
        ).exec();
    },

    // DELETE
    async deleteReview(id) {
        return ReviewModel.findOneAndDelete({ id: parseInt(id) }).exec();
    },

    // EXTRA: buscar reviews que contengan cierto tag
    async findReviewsByTagId(tagId) {
        return ReviewModel.find({ tags: parseInt(tagId) }).exec();
    }
};
