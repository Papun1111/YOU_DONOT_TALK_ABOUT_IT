"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a User.
 * Represents a user's dual identity within the application.
 */
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    publicName: { type: String, required: true, unique: true, trim: true },
    publicAvatar: { type: String, required: true }, // Stores base64 SVG data
    hiddenName: { type: String, required: true, unique: true, trim: true },
    hiddenAvatar: { type: String, required: true }, // Stores base64 SVG data
    secretPhraseHash: { type: String, select: false }, // Hidden by default on queries
    createdAt: { type: Date, default: Date.now },
});
exports.User = (0, mongoose_1.model)('User', userSchema);
