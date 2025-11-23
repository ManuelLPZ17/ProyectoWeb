// // BACKEND/services/tags_service.js

// // SIMULACIÓN DE DATOS
// let tags = []; 

// exports.saveTag = async (tagObject) => {
//     // Aquí iría la validación de nombre duplicado
//     tags.push(tagObject.toObj());
//     return tagObject.toObj();
// };

// exports.getTagById = async (id) => {
//     return tags.find(t => t.id === parseInt(id)) || null;
// };

// exports.getAllTags = async () => {
//     return tags;
// };

// exports.updateTag = async (id, tagObject) => {
//     const index = tags.findIndex(t => t.id === parseInt(id));
//     if (index !== -1) {
//         tags[index] = tagObject.toObj();
//         return tags[index];
//     }
//     return null;
// };

// exports.deleteTag = async (id) => {
//     const index = tags.findIndex(t => t.id === parseInt(id));
//     if (index !== -1) {
//         const deletedTag = tags[index];
//         tags.splice(index, 1);
//         return deletedTag;
//     }
//     return null;
// };

const { dbConnect } = require('../database/db.connector');
const { Tag } = require('../models/tag');

const COLLECTION = "tags";

module.exports = {

    async findByName(name) {
        const db = await dbConnect();
        return await db.collection(COLLECTION).findOne({ name: name });
    },

    async getTagById(id) {
        const db = await dbConnect();
        return await db.collection(COLLECTION).findOne({ id: id });
    },

    async getTagsByUser(id_user) {
        const db = await dbConnect();
        return await db.collection(COLLECTION).find({ id_user: id_user }).toArray();
    },

    async saveTag(tagInstance) {
        const db = await dbConnect();

        const last = await db.collection(COLLECTION)
            .find({})
            .sort({ id: -1 })
            .limit(1)
            .toArray();

        const nextId = (last.length > 0) ? last[0].id + 1 : 1;

        const tagObj = tagInstance.toObj();
        tagObj.id = nextId;

        await db.collection(COLLECTION).insertOne(tagObj);

        return tagObj;
    },

    async updateTag(id, tagInstance) {
        const db = await dbConnect();

        const result = await db.collection(COLLECTION).updateOne(
            { id: id },
            { $set: tagInstance.toObj() }
        );

        if (result.matchedCount === 0) {
            return null;
        }

        return tagInstance.toObj();
    },

    async deleteTag(id) {
        const db = await dbConnect();

        const deleted = await db.collection(COLLECTION).findOneAndDelete({
            id: id
        });

        return deleted.value;
    }
};
