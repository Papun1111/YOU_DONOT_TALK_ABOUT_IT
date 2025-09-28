"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalLeaderboard = exports.generateGlobalLeaderboard = void 0;
/**
 * @fileoverview Service for generating and retrieving leaderboards.
 * For performance, this service should generate snapshots rather than calculating on the fly.
 */
const Submission_model_1 = require("../api/models/Submission.model");
const LeaderboardSnapshot_model_1 = require("../api/models/LeaderboardSnapshot.model");
const User_model_1 = require("../api/models/User.model");
const Logger = __importStar(require("../utils/logger"));
/**
 * Generates and saves a new global leaderboard snapshot.
 * This is an expensive operation and should be run periodically as a background job.
 * @returns {Promise<void>}
 */
const generateGlobalLeaderboard = () => __awaiter(void 0, void 0, void 0, function* () {
    Logger.info('Starting global leaderboard generation...', 'LeaderboardService');
    // Use MongoDB aggregation pipeline to calculate total scores for all users.
    const userScores = yield Submission_model_1.Submission.aggregate([
        { $match: { isCorrect: true } }, // Only count correct submissions
        { $group: { _id: '$userId', totalScore: { $sum: '$scoreDelta' } } },
        { $sort: { totalScore: -1 } },
        { $limit: 100 } // Top 100 users
    ]);
    // Fetch user details for the top scores
    const userIds = userScores.map(score => score._id);
    // FIX: Add .lean() to return plain JS objects with correct types, resolving the '_id' type error.
    const users = yield User_model_1.User.find({ '_id': { $in: userIds } }).select('publicName publicAvatar').lean();
    // With .lean(), TypeScript can correctly infer the type of 'u', so no explicit typing is needed.
    const userMap = new Map(users.map(u => [u._id.toString(), u]));
    // This uses the ILeaderboardItem interface which expects an ObjectId for userId, matching the DB schema.
    const leaderboardItems = userScores.map(score => {
        var _a, _b;
        return ({
            userId: score._id, // score._id is an ObjectId from the aggregation, which is correct for saving.
            publicName: ((_a = userMap.get(score._id.toString())) === null || _a === void 0 ? void 0 : _a.publicName) || 'Anonymous',
            publicAvatar: ((_b = userMap.get(score._id.toString())) === null || _b === void 0 ? void 0 : _b.publicAvatar) || '',
            score: score.totalScore,
        });
    });
    // Save the new snapshot
    yield LeaderboardSnapshot_model_1.LeaderboardSnapshot.create({
        scope: 'global',
        items: leaderboardItems,
    });
    Logger.info('Global leaderboard snapshot generated successfully.', 'LeaderboardService');
});
exports.generateGlobalLeaderboard = generateGlobalLeaderboard;
/**
 * Retrieves the most recent global leaderboard.
 * @returns {Promise<LeaderboardItem[]>} The list of leaderboard items with string userIds.
 */
const getGlobalLeaderboard = () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield LeaderboardSnapshot_model_1.LeaderboardSnapshot.findOne({ scope: 'global' }).sort({ createdAt: -1 });
    if (!snapshot) {
        return [];
    }
    // Map over the items from the database and convert the userId from ObjectId to string
    // for the API response. This resolves the type mismatch.
    const responseItems = snapshot.items.map(dbItem => ({
        userId: dbItem.userId.toString(),
        publicName: dbItem.publicName,
        publicAvatar: dbItem.publicAvatar,
        score: dbItem.score,
    }));
    return responseItems;
});
exports.getGlobalLeaderboard = getGlobalLeaderboard;
// Note: A `generateRoomLeaderboard` function would follow a similar pattern,
// but with an additional `$match` stage for `roomId`.
