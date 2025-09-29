import { Router } from 'express';
import * as ChallengeController from '../controllers/challenge.controller';
import { strictLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   POST /api/challenges
 * @desc    Create a new challenge (for room owners)
 * @access  Private (requires session, ownership checked in controller)
 */
router.post(
    '/',
    strictLimiter,
    ChallengeController.createChallenge
);

/**
 * @route   POST /api/challenges/:challengeId/submit
 * @desc    Submit an answer to a challenge
 * @access  Private (requires session)
 */
router.post(
    '/:challengeId/submit',
    strictLimiter,
    ChallengeController.submitAnswer
);

export default router;

