"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardSnapshot = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a LeaderboardSnapshot.
 * Stores a pre-calculated leaderboard to improve performance.
 */
const mongoose_1 = require("mongoose");
const leaderboardItemSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    publicName: { type: String, required: true },
    publicAvatar: { type: String, required: true },
    score: { type: Number, required: true },
}, { _id: false });
const leaderboardSnapshotSchema = new mongoose_1.Schema({
    scope: { type: String, enum: ['global', 'room'], required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room' },
    items: [leaderboardItemSchema],
    createdAt: { type: Date, default: Date.now, index: -1 },
});
exports.LeaderboardSnapshot = (0, mongoose_1.model)('LeaderboardSnapshot', leaderboardSnapshotSchema);
