"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a Challenge.
 * Can be either a puzzle or a writing dare.
 */
const mongoose_1 = require("mongoose");
const challengeSchema = new mongoose_1.Schema({
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
    type: { type: String, enum: ['puzzle', 'dare'], required: true },
    title: { type: String, required: true, trim: true },
    prompt: { type: String, required: true },
    options: [{ type: String }],
    correctIndex: { type: Number },
    difficulty: { type: Number, required: true, min: 1, max: 10 },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Challenge = (0, mongoose_1.model)('Challenge', challengeSchema);
