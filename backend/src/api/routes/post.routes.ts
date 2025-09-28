/**
 * @fileoverview Routes for creating and interacting with posts in the feed.
 */
import { Router } from 'express';
import * as PostController from '../controllers/post.controller';
// Assuming specific limiters for these actions will be created.
// If not, 'strictLimiter' can be used as a fallback.
import { generalLimiter, strictLimiter } from '../middleware/rateLimiter';
// import { moderationMiddleware } from '../middleware/moderation';

const router = Router();

/**
 * @route   GET /api/posts
 * @desc    Get the main feed of posts (supports cursor-based pagination)
 * @access  Public
 */
router.get(
    '/',
    generalLimiter,
    PostController.getFeed
);

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private (implicitly, requires a session)
 */
router.post(
    '/',
    strictLimiter, // Using a strict limiter for content creation
    // moderationMiddleware, // IMPORTANT: Enable this once the middleware is complete
    PostController.createPost
);

/**
 * @route   POST /api/posts/:postId/react
 * @desc    React to a post (e.g., upvote, flag)
 * @access  Private (implicitly, requires a session)
 */
router.post(
    '/:postId/react',
    strictLimiter, // Reactions should also be rate-limited
    PostController.reactToPost
);

export default router;

