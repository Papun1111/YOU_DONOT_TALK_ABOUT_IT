"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
/**
 * @fileoverview Mongoose model and TypeScript interface for a Room.
 * Represents a themed area within the application with its own rules.
 */
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    rules: [{ type: String }],
    weights: { type: Map, of: Number },
    createdAt: { type: Date, default: Date.now },
});
exports.Room = (0, mongoose_1.model)('Room', roomSchema);
