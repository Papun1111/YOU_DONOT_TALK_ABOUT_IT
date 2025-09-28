/**
 * @fileoverview Mongoose model and TypeScript interface for a Reaction.
 * Represents a user's reaction (upvote or flag) to a post.
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface IReaction extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'upvote' | 'flag';
  createdAt: Date;
}

const reactionSchema = new Schema<IReaction>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['upvote', 'flag'], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user can only react once to a post
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Reaction = model<IReaction>('Reaction', reactionSchema);
