// BACKEND/services/tags_service.js

// SIMULACIÓN DE DATOS
let tags = []; 

exports.saveTag = async (tagObject) => {
    // Aquí iría la validación de nombre duplicado
    tags.push(tagObject.toObj());
    return tagObject.toObj();
};

exports.getTagById = async (id) => {
    return tags.find(t => t.id === parseInt(id)) || null;
};

exports.getAllTags = async () => {
    return tags;
};

exports.updateTag = async (id, tagObject) => {
    const index = tags.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
        tags[index] = tagObject.toObj();
        return tags[index];
    }
    return null;
};

exports.deleteTag = async (id) => {
    const index = tags.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
        const deletedTag = tags[index];
        tags.splice(index, 1);
        return deletedTag;
    }
    return null;
};