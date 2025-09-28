"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a Post.
 * Represents a message in the anonymous dark social feed.
 */
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true },
    body: { type: String, required: true, trim: true, maxLength: 500 },
    redactions: { type: mongoose_1.Schema.Types.Mixed },
    hiddenSelfShown: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
// Full-text index on the post body to enable searching
postSchema.index({ body: 'text' });
postSchema.index({ createdAt: -1 });
exports.Post = (0, mongoose_1.model)('Post', postSchema);
