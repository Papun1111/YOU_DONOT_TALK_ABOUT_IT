/**
 * @fileoverview Mongoose model and TypeScript interface for the ModerationQueue.
 * Tracks content that needs review by a moderator.
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface IModerationQueue extends Document {
  itemType: 'post' | 'submission';
  itemId: Types.ObjectId;
  reason: string;
  status: 'pending' | 'approved' | 'removed';
  createdAt: Date;
  reviewedAt?: Date;
}

const moderationQueueSchema = new Schema<IModerationQueue>({
  itemType: { type: String, enum: ['post', 'submission'], required: true },
  itemId: { type: Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'removed'], default: 'pending', index: true },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

export const ModerationQueue = model<IModerationQueue>('ModerationQueue', moderationQueueSchema);
