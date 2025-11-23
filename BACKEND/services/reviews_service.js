// BACKEND/services/reviews_service.js

// SIMULACIÓN DE DATOS
let reviews = []; 

exports.saveReview = async (reviewObject) => {
    reviews.push(reviewObject.toObj());
    return reviewObject.toObj();
};

exports.getReviewById = async (id) => {
    return reviews.find(r => r.id === parseInt(id)) || null;
};

exports.getAllReviews = async () => {
    return reviews;
};

exports.updateReview = async (id, reviewObject) => {
    const index = reviews.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
        reviews[index] = reviewObject.toObj();
        return reviews[index];
    }
    return null;
};

exports.deleteReview = async (id) => {
    const index = reviews.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
        const deletedReview = reviews[index];
        reviews.splice(index, 1);
        return deletedReview;
    }
    return null;
};

// Se usará para validar si un Tag (etiqueta) está en uso antes de eliminarla
exports.findReviewsByTagId = async (tagId) => {
    return reviews.filter(r => r.tags && r.tags.includes(parseInt(tagId)));
};