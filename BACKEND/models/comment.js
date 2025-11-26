// BACKEND/models/comment.js

let nextCommentId = 1;
function getNextCommentID() {
    return nextCommentId++;
}

class Comment {
    constructor({ id_review, movie_id, owner, owner_name, content }) {
        if (!id_review) throw new Error("id_review is required");
        if (!movie_id) throw new Error("movie_id is required");
        if (!owner) throw new Error("owner is required");
        if (!owner_name) throw new Error("owner_name is required");
        if (!content || content.trim() === "") throw new Error("content cannot be empty");

        this.id = getNextCommentID();
        this.id_review = id_review;
        this.movie_id = movie_id;
        this.owner = owner;
        this.owner_name = owner_name;
        this.content = content;
        this.created_at = new Date().toISOString();
    }

    toObj() {
        return {
            id: this.id,
            id_review: this.id_review,
            movie_id: this.movie_id,
            owner: this.owner,
            owner_name: this.owner_name,
            content: this.content,
            created_at: this.created_at
        };
    }
}

module.exports = Comment;