// BACKEND/models/comment.js

let nextCommentId = 1;
function getNextCommentID() {
    return nextCommentId++;
}

class CommentException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

class Comment {
    #id;
    #id_review; // ID de la reseña (Task) comentada
    #id_user;   // ID del usuario que comentó
    #content;   // Cuerpo del comentario
    #created_at;

    constructor(id_review, id_user, content) {
        this.#id = getNextCommentID();
        this.#created_at = new Date().toISOString();
        
        this.id_review = id_review;
        this.id_user = id_user;
        this.content = content;
    }

    // --- GETTERS ---
    get id() { return this.#id; }
    get id_review() { return this.#id_review; }
    get id_user() { return this.#id_user; }
    get content() { return this.#content; }
    get created_at() { return this.#created_at; }

    // --- SETTERS con Validación ---
    set id(value) {
        throw new CommentException("IDs are auto-generated. Cannot be modified.");
    }
    set id_review(value) {
        // Regla: La reseña debe existir (validación en el controlador)
        if (!value) throw new CommentException("Comment must be linked to a Review (id_review).");
        this.#id_review = value;
    }
    set id_user(value) {
        // Regla: El usuario debe existir (validación en el controlador)
        if (!value) throw new CommentException("Comment must be linked to a User (id_user).");
        this.#id_user = value;
    }
    set content(value) {
        if (!value || value.trim() === '') {
            throw new CommentException("Comment content cannot be empty.");
        }
        this.#content = value;
    }
    set created_at(value) {
         throw new CommentException("Creation date cannot be modified.");
    }

    toObj() {
        return {
            id: this.#id,
            id_review: this.#id_review,
            id_user: this.#id_user,
            content: this.#content,
            created_at: this.#created_at
        };
    }
}

module.exports = { getNextCommentID, CommentException, Comment };