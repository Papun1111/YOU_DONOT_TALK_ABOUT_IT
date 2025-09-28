/**
 * @fileoverview Service for generating and retrieving leaderboards.
 * For performance, this service should generate snapshots rather than calculating on the fly.
 */
import { Submission } from '../api/models/Submission.model';
import { LeaderboardSnapshot, ILeaderboardItem } from '../api/models/LeaderboardSnapshot.model';
import { User } from '../api/models/User.model';
import * as Logger from '../utils/logger';

// This is the shape of the data sent to the client in API responses.
type LeaderboardItem = {
  userId: string;
  publicName: string;
  publicAvatar: string;
  score: number;
};

/**
 * Generates and saves a new global leaderboard snapshot.
 * This is an expensive operation and should be run periodically as a background job.
 * @returns {Promise<void>}
 */
export const generateGlobalLeaderboard = async (): Promise<void> => {
  Logger.info('Starting global leaderboard generation...', 'LeaderboardService');

  // Use MongoDB aggregation pipeline to calculate total scores for all users.
  const userScores = await Submission.aggregate([
    { $match: { isCorrect: true } }, // Only count correct submissions
    { $group: { _id: '$userId', totalScore: { $sum: '$scoreDelta' } } },
    { $sort: { totalScore: -1 } },
    { $limit: 100 } // Top 100 users
  ]);

  // Fetch user details for the top scores
  const userIds = userScores.map(score => score._id);
  // FIX: Add .lean() to return plain JS objects with correct types, resolving the '_id' type error.
  const users = await User.find({ '_id': { $in: userIds } }).select('publicName publicAvatar').lean();
  
  // With .lean(), TypeScript can correctly infer the type of 'u', so no explicit typing is needed.
  const userMap = new Map(users.map(u => [u._id.toString(), u]));

  // This uses the ILeaderboardItem interface which expects an ObjectId for userId, matching the DB schema.
  const leaderboardItems: ILeaderboardItem[] = userScores.map(score => ({
    userId: score._id, // score._id is an ObjectId from the aggregation, which is correct for saving.
    publicName: userMap.get(score._id.toString())?.publicName || 'Anonymous',
    publicAvatar: userMap.get(score._id.toString())?.publicAvatar || '',
    score: score.totalScore,
  }));
  
  // Save the new snapshot
  await LeaderboardSnapshot.create({
    scope: 'global',
    items: leaderboardItems,
  });

  Logger.info('Global leaderboard snapshot generated successfully.', 'LeaderboardService');
};

/**
 * Retrieves the most recent global leaderboard.
 * @returns {Promise<LeaderboardItem[]>} The list of leaderboard items with string userIds.
 */
export const getGlobalLeaderboard = async (): Promise<LeaderboardItem[]> => {
    const snapshot = await LeaderboardSnapshot.findOne({ scope: 'global' }).sort({ createdAt: -1 });
    
    if (!snapshot) {
        return [];
    }

    // Map over the items from the database and convert the userId from ObjectId to string
    // for the API response. This resolves the type mismatch.
    const responseItems: LeaderboardItem[] = snapshot.items.map(dbItem => ({
        userId: dbItem.userId.toString(),
        publicName: dbItem.publicName,
        publicAvatar: dbItem.publicAvatar,
        score: dbItem.score,
    }));

    return responseItems;
};

// Note: A `generateRoomLeaderboard` function would follow a similar pattern,
// but with an additional `$match` stage for `roomId`.

