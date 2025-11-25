// BACKEND/services/tags_service.js

const TagModel = require('../schemas/tag_schema');

// =============================================
// Obtener siguiente ID numérico (manual)
// =============================================
async function getNextTagId() {
    const last = await TagModel.find().sort({ id: -1 }).limit(1);
    return last.length > 0 ? last[0].id + 1 : 1;
}

module.exports = {

    // =============================================
    // Crear nuevo Tag
    // =============================================
    async createTag(data) {
        const nextId = await getNextTagId();
        const tag = new TagModel({
            id: nextId,
            name: data.name,
            id_user: data.id_user,
            movie_id: data.movie_id
        });
        return await tag.save();
    },

    // =============================================
    // Buscar por ID
    // =============================================
    async getTagById(id) {
        return await TagModel.findOne({ id: parseInt(id) });
    },

    // =============================================
    // Buscar por nombre
    // =============================================
    async findByName(name) {
        return await TagModel.findOne({ name });
    },

    // =============================================
    // Buscar por usuario
    // =============================================
    async getTagsByUser(id_user) {
        return await TagModel.find({ id_user: parseInt(id_user) });
    },

    // Obtener tags por película
    async getTagsByMovie(movie_id) {
        return await TagModel.find({ movie_id: parseInt(movie_id) });
    },

    // =============================================
    // Actualizar Tag
    // =============================================
    async updateTag(id, updateFields) {
        return await TagModel.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: updateFields },
            { new: true }
        );
    },

    // =============================================
    // Eliminar
    // =============================================
    async deleteTag(id) {
        return await TagModel.findOneAndDelete({ id: parseInt(id) });
    }
};
