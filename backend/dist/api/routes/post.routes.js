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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview Routes for creating and interacting with posts in the feed.
 */
const express_1 = require("express");
const PostController = __importStar(require("../controllers/post.controller"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const moderation_1 = require("../middleware/moderation");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/posts
 * @desc    Get the main feed of posts
 * @access  Public
 */
router.get('/', rateLimiter_1.generalLimiter, PostController.getFeed);
/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private (implicitly, requires a session)
 */
router.post('/', rateLimiter_1.strictLimiter, moderation_1.moderationMiddleware, // IMPORTANT: This safety check is now active.
PostController.createPost);
/**
 * @route   POST /api/posts/:postId/react
 * @desc    React to a post (e.g., upvote, flag)
 * @access  Private (implicitly, requires a session)
 */
router.post('/:postId/react', rateLimiter_1.strictLimiter, PostController.reactToPost);
exports.default = router;
