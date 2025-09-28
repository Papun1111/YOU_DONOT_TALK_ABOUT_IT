/**
 * @fileoverview Mongoose model and TypeScript interface for a Room.
 * Represents a themed area within the application with its own rules.
 */
import { Schema, model, Document } from 'mongoose';

export interface IRoom extends Document {
  key: string; // A unique string key like 'the-basement'
  name: string;
  description: string;
  rules: string[];
  weights: Map<string, number>; // For scoring variations, e.g., 'puzzle_weight', 'dare_weight'
  createdAt: Date;
}

const roomSchema = new Schema<IRoom>({
  key: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  rules: [{ type: String }],
  weights: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now },
});

export const Room = model<IRoom>('Room', roomSchema);
