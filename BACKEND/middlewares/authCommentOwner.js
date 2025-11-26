// BACKEND/middlewares/authCommentOwner.js

const CommentService = require('../services/comments_service');
const UserService = require('../services/users_service');

exports.authCommentOwnerMiddleware = async (req, res, next) => {
    const auth = req.headers["x-auth"];
    const id = parseInt(req.params.id);

    const comment = await CommentService.getCommentById(id);
    if (!comment) return res.status(404).send("Comment not found");

    const userOwner = await UserService.getUserById(comment.owner);

    if (userOwner.password !== auth) {
        return res.status(403).send("Forbidden: You are not the owner");
    }

    req.userId = userOwner.id;
    next();
};