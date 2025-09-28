"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationQueue = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for the ModerationQueue.
 * Tracks content that needs review by a moderator.
 */
const mongoose_1 = require("mongoose");
const moderationQueueSchema = new mongoose_1.Schema({
    itemType: { type: String, enum: ['post', 'submission'], required: true },
    itemId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'removed'], default: 'pending', index: true },
    createdAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
});
exports.ModerationQueue = (0, mongoose_1.model)('ModerationQueue', moderationQueueSchema);
