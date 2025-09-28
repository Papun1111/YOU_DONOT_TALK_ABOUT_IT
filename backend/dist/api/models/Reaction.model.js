"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reaction = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a Reaction.
 * Represents a user's reaction (upvote or flag) to a post.
 */
const mongoose_1 = require("mongoose");
const reactionSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['upvote', 'flag'], required: true },
    createdAt: { type: Date, default: Date.now },
});
// Ensure a user can only react once to a post
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });
exports.Reaction = (0, mongoose_1.model)('Reaction', reactionSchema);
