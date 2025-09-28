"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a Submission.
 * Represents a user's attempt at a challenge.
 */
const mongoose_1 = require("mongoose");
const submissionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    challengeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    content: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean },
    timeMs: { type: Number },
    scoreDelta: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
// Compound index for efficiently querying a user's submissions
submissionSchema.index({ userId: 1, createdAt: -1 });
exports.Submission = (0, mongoose_1.model)('Submission', submissionSchema);
