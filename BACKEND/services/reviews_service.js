// BACKEND/services/reviews_service.js

const ReviewMongooseModel = require('../schemas/reviews_schema'); // Importa el modelo de Mongoose
// const Review = require('../models/review'); // (Puedes importar el modelo JS si necesitas sus reglas)


// 1. GUARDAR una nueva reseña (POST /reviews)
exports.saveReview = async (reviewObject) => {
    // 1. Crea el objeto Mongoose a partir de los datos validados por el modelo JS
    const newReview = new ReviewMongooseModel(reviewObject.toObj());
    
    // 2. Guarda y devuelve el objeto guardado
    return newReview.save(); 
};

// 2. OBTENER reseña por ID (GET /reviews/:id)
exports.getReviewById = async (id) => {
    // Busca por el ID consecutivo numérico
    return ReviewMongooseModel.findOne({ id: parseInt(id) }).exec();
};

// 3. OBTENER todas las reseñas
exports.getAllReviews = async () => {
    // Devuelve todos los documentos
    return ReviewMongooseModel.find({}).exec();
};

// 4. ACTUALIZAR reseña (PATCH /reviews/:id)
exports.updateReview = async (id, updateFields) => {
    // Usa findOneAndUpdate para aplicar solo los cambios y ejecutar validadores
    return ReviewMongooseModel.findOneAndUpdate(
        { id: parseInt(id) }, 
        { $set: updateFields },
        { new: true, runValidators: true }
    ).exec();
};

// 5. ELIMINAR reseña (DELETE /reviews/:id)
exports.deleteReview = async (id) => {
    // Busca y elimina por el ID numérico
    return ReviewMongooseModel.findOneAndDelete({ id: parseInt(id) }).exec();
};

// 6. VALIDACIÓN DE INTEGRIDAD: Buscar Reseñas por Propietario (Owner)
exports.findReviewsByOwner = async (ownerId) => {
    // CORRECCIÓN: Usar find() para devolver un array de documentos Mongoose
    try {
        return ReviewMongooseModel.find({ owner: parseInt(ownerId) }).exec();
    } catch (e) {
        // En caso de error de Mongoose, devolvemos un array vacío para no bloquear el sistema.
        console.error("Mongoose error in findReviewsByOwner:", e);
        return [];
    }
 };
// 7. VALIDACIÓN DE INTEGRIDAD: Buscar Reseñas por Etiqueta (Tag)
exports.findReviewsByTagId = async (tagId) => {
    // Busca todas las reseñas donde el array 'tags' contiene el ID de la etiqueta
    return ReviewMongooseModel.find({ tags: parseInt(tagId) }).exec();
};