/**
 * @fileoverview Mongoose model and TypeScript interface for a Post.
 * Represents a message in the anonymous dark social feed.
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  userId: Types.ObjectId;
  roomId: Types.ObjectId;
  body: string;
  redactions?: any; // For future use with unreliable narrator effect
  hiddenSelfShown?: boolean;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  body: { type: String, required: true, trim: true, maxLength: 500 },
  redactions: { type: Schema.Types.Mixed },
  hiddenSelfShown: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Full-text index on the post body to enable searching
postSchema.index({ body: 'text' });
postSchema.index({ createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);
