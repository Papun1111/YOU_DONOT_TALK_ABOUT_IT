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
exports.reactToPost = exports.getFeed = exports.createPost = void 0;
const Post_model_1 = require("../models/Post.model");
const Reaction_model_1 = require("../models/Reaction.model");
const ModerationService = __importStar(require("../../services/moderation.service"));
const ApiResponse = __importStar(require("../../utils/apiResponse"));
const socket_1 = require("../../socket");
/**
 * Creates a new post in a room's feed.
 */
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to post.');
        }
        const { body, roomId, hiddenSelfShown } = req.body;
        if (!body || !roomId) {
            return ApiResponse.error(res, 400, 'Post body and room ID are required.');
        }
        const post = yield Post_model_1.Post.create({
            userId,
            roomId,
            body,
            hiddenSelfShown: hiddenSelfShown || false,
        });
        // Populate user data for the broadcast
        yield post.populate('userId', 'publicName publicAvatar');
        // Broadcast the new post to all connected clients in the feed
        (0, socket_1.getIO)().of('/feed').emit('feed:new_post', post);
        return ApiResponse.success(res, 201, 'Post created successfully.', post);
    }
    catch (error) {
        next(error);
    }
});
exports.createPost = createPost;
/**
 * Get posts for the feed with cursor-based pagination.
 */
const getFeed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cursor, limit = 20 } = req.query;
        const query = Post_model_1.Post.find(cursor ? { _id: { $lt: cursor } } : {})
            .populate('userId', 'publicName publicAvatar')
            .sort({ createdAt: -1 })
            .limit(Number(limit));
        const posts = yield query.exec();
        const nextCursor = posts.length === Number(limit) ? posts[posts.length - 1]._id : null;
        return ApiResponse.success(res, 200, 'Feed retrieved successfully.', { posts, nextCursor });
    }
    catch (error) {
        next(error);
    }
});
exports.getFeed = getFeed;
/**
 * Adds a reaction to a post (upvote or flag).
 */
const reactToPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const userId = req.session.userId;
        const { type } = req.body; // 'upvote' or 'flag'
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to react.');
        }
        if (type === 'flag') {
            yield ModerationService.flagContentForReview('post', postId, 'user_report');
            return ApiResponse.success(res, 200, 'Post has been flagged for review.');
        }
        if (type === 'upvote') {
            // Prevent duplicate upvotes
            const existingReaction = yield Reaction_model_1.Reaction.findOne({ postId, userId, type: 'upvote' });
            if (existingReaction) {
                return ApiResponse.error(res, 409, 'You have already upvoted this post.');
            }
            const reaction = yield Reaction_model_1.Reaction.create({ postId, userId, type: 'upvote' });
            // Broadcast the reaction update
            (0, socket_1.getIO)().of('/feed').emit('post:reaction', { postId, type: 'upvote' });
            return ApiResponse.success(res, 201, 'Post upvoted.', reaction);
        }
        return ApiResponse.error(res, 400, 'Invalid reaction type.');
    }
    catch (error) {
        next(error);
    }
});
exports.reactToPost = reactToPost;
