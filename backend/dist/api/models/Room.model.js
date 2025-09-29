"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a Room.
 * Represents a themed area within the application with its own rules and owner.
 */
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    // --- NEW FIELD ---
    // This links the room to a specific user, establishing them as the "Room Master".
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rules: [{ type: String }],
    // --- UPDATED STRUCTURE ---
    // Using a nested object is more explicit and a common Mongoose pattern.
    weights: {
        puzzle: { type: Number, default: 1.0 },
        dare: { type: Number, default: 1.0 },
        upvote: { type: Number, default: 1.0 },
    },
    createdAt: { type: Date, default: Date.now },
});
// Add an index on the ownerId for efficient querying of a user's rooms.
roomSchema.index({ ownerId: 1 });
exports.Room = (0, mongoose_1.model)('Room', roomSchema);
