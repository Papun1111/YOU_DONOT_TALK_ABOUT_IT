/**
 * @fileoverview Main router that aggregates all other route modules.
 */
import { Router } from 'express';
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';
import challengeRoutes from './challenge.routes';
import postRoutes from './post.routes';
import leaderboardRoutes from './leaderboard.routes';

const router = Router();

// Mount all resource-specific routers
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/challenges', challengeRoutes);
router.use('/posts', postRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;
