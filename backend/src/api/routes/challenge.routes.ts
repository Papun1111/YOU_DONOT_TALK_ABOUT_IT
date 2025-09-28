/**
 * @fileoverview Routes for challenge-related actions, like submissions.
 */
import { Router } from 'express';
import * as ChallengeController from '../controllers/challenge.controller';
// FIX: The non-existent 'submissionLimiter' has been replaced with 'strictLimiter'.
import { strictLimiter } from '../middleware/rateLimiter';

const router = Router();

// Route for a user to submit an answer to a challenge
// POST /api/challenges/:challengeId/submit
router.post('/:challengeId/submit', strictLimiter, ChallengeController.submitAnswer);

export default router;

