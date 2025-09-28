/**
 * @fileoverview Routes for fetching leaderboards.
 */
import { Router } from 'express';
import * as LeaderboardController from '../controllers/leaderboard.controller';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

// Route to get the global leaderboard
// GET /api/leaderboard
router.get('/', generalLimiter, LeaderboardController.getGlobalLeaderboard);

// Route to get the leaderboard for a specific room
// GET /api/leaderboard/:roomKey
router.get('/:roomKey', generalLimiter, LeaderboardController.getRoomLeaderboard);

export default router;
