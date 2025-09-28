/**
 * @fileoverview Routes for creating and interacting with posts in the feed.
 */
import { Router } from 'express';
import * as PostController from '../controllers/post.controller';
import { generalLimiter, strictLimiter } from '../middleware/rateLimiter';
import { moderationMiddleware } from '../middleware/moderation';

const router = Router();

/**
 * @route   GET /api/posts
 * @desc    Get the main feed of posts
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
    strictLimiter,
    moderationMiddleware, // IMPORTANT: This safety check is now active.
    PostController.createPost
);

/**
 * @route   POST /api/posts/:postId/react
 * @desc    React to a post (e.g., upvote, flag)
 * @access  Private (implicitly, requires a session)
 */
router.post(
    '/:postId/react',
    strictLimiter,
    PostController.reactToPost
);

export default router;

