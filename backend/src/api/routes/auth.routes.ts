/**
 * @fileoverview Routes for user authentication and session management.
 */
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

// Route to create a new anonymous session
// POST /api/auth/anonymous
router.post('/anonymous', generalLimiter, AuthController.createAnonymousSession);

// Route to restore a session using a secret phrase
// POST /api/auth/restore
router.post('/restore', generalLimiter, AuthController.restoreSession);

export default router;
