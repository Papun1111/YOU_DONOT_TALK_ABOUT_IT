/**
 * @fileoverview Mongoose model and TypeScript interface for a Challenge.
 * Can be either a puzzle or a writing dare.
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface IChallenge extends Document {
  roomId: Types.ObjectId;
  type: 'puzzle' | 'dare';
  title: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  difficulty: number; // e.g., 1-10
  active: boolean;
  createdAt: Date;
}

const challengeSchema = new Schema<IChallenge>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  type: { type: String, enum: ['puzzle', 'dare'], required: true },
  title: { type: String, required: true, trim: true },
  prompt: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number },
  difficulty: { type: Number, required: true, min: 1, max: 10 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Challenge = model<IChallenge>('Challenge', challengeSchema);
