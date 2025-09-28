import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { strictLimiter } from '../middleware/rateLimiter';

const router = Router();

// FIX: This new route connects the /me URL to your getCurrentUser function.
// This is the change that will resolve the 404 error.
router.get('/me', AuthController.getCurrentUser);

// Route to create a new anonymous session
router.post('/anonymous', strictLimiter, AuthController.createAnonymousSession);

// Route to restore a session using a secret phrase
router.post('/restore', strictLimiter, AuthController.restoreSession);

// Route to log out and destroy the session
router.post('/logout', AuthController.logout);

export default router;

