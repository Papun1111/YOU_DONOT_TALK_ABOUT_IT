/**
 * @fileoverview Mongoose model and TypeScript interface for a LeaderboardSnapshot.
 * Stores a pre-calculated leaderboard to improve performance.
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface ILeaderboardItem {
  userId: Types.ObjectId;
  publicName: string;
  publicAvatar: string;
  score: number;
}

export interface ILeaderboardSnapshot extends Document {
  scope: 'global' | 'room';
  roomId?: Types.ObjectId;
  items: ILeaderboardItem[];
  createdAt: Date;
}

const leaderboardItemSchema = new Schema<ILeaderboardItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publicName: { type: String, required: true },
  publicAvatar: { type: String, required: true },
  score: { type: Number, required: true },
}, { _id: false });

const leaderboardSnapshotSchema = new Schema<ILeaderboardSnapshot>({
  scope: { type: String, enum: ['global', 'room'], required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  items: [leaderboardItemSchema],
  createdAt: { type: Date, default: Date.now, index: -1 },
});

export const LeaderboardSnapshot = model<ILeaderboardSnapshot>('LeaderboardSnapshot', leaderboardSnapshotSchema);
