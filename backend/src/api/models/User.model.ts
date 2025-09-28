/**
 * @fileoverview Mongoose model and TypeScript interface for a User.
 * Represents a user's dual identity within the application.
 */
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  publicName: string;
  publicAvatar: string;
  hiddenName: string;
  hiddenAvatar: string;
  secretPhraseHash?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  publicName: { type: String, required: true, unique: true, trim: true },
  publicAvatar: { type: String, required: true }, // Stores base64 SVG data
  hiddenName: { type: String, required: true, unique: true, trim: true },
  hiddenAvatar: { type: String, required: true }, // Stores base64 SVG data
  secretPhraseHash: { type: String, select: false }, // Hidden by default on queries
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', userSchema);
