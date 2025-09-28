/**
 * @fileoverview Mongoose model and TypeScript interface for a Submission.
 * Represents a user's attempt at a challenge.
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  content: string; // The user's answer or dare text
  isCorrect?: boolean;
  timeMs?: number; // Time taken for puzzles
  scoreDelta: number; // The score change from this submission
  createdAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  content: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean },
  timeMs: { type: Number },
  scoreDelta: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Compound index for efficiently querying a user's submissions
submissionSchema.index({ userId: 1, createdAt: -1 });

export const Submission = model<ISubmission>('Submission', submissionSchema);
