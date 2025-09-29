/**
 * @fileoverview Mongoose model and TypeScript interface for a Room.
 * Represents a themed area within the application with its own rules and owner.
 */
import { Schema, model, Document } from 'mongoose';

export interface IRoom extends Document {
  key: string;        // A unique string key like 'the-basement'
  name: string;
  description: string;
  ownerId: Schema.Types.ObjectId; // The user who created and controls this room
  rules: string[];
  weights: {          // For scoring variations
    puzzle: number;
    dare: number;
    upvote: number;
  };
  createdAt: Date;
}

const roomSchema = new Schema<IRoom>({
  key: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  
  // --- NEW FIELD ---
  // This links the room to a specific user, establishing them as the "Room Master".
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
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

export const Room = model<IRoom>('Room', roomSchema);

