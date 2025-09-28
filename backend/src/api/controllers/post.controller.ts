/**
 * @fileoverview Controller for handling posts and reactions in the feed.
 */
import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post.model';
import { Reaction } from '../models/Reaction.model';
import * as ModerationService from '../../services/moderation.service';
import * as ApiResponse from '../../utils/apiResponse';
import { getIO } from '../../socket';

/**
 * Creates a new post in a room's feed.
 */
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return ApiResponse.error(res, 401, 'You must be logged in to post.');
    }

    const { body, roomId, hiddenSelfShown } = req.body;
    if (!body || !roomId) {
      return ApiResponse.error(res, 400, 'Post body and room ID are required.');
    }

    const post = await Post.create({
      userId,
      roomId,
      body,
      hiddenSelfShown: hiddenSelfShown || false,
    });
    
    // Populate user data for the broadcast
    await post.populate('userId', 'publicName publicAvatar');

    // Broadcast the new post to all connected clients in the feed
    getIO().of('/feed').emit('feed:new_post', post);

    return ApiResponse.success(res, 201, 'Post created successfully.', post);
  } catch (error) {
    next(error);
  }
};

/**
 * Get posts for the feed with cursor-based pagination.
 */
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cursor, limit = 20 } = req.query;
        
        const query = Post.find(cursor ? { _id: { $lt: cursor } } : {})
            .populate('userId', 'publicName publicAvatar')
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        const posts = await query.exec();
        
        const nextCursor = posts.length === Number(limit) ? posts[posts.length - 1]._id : null;

        return ApiResponse.success(res, 200, 'Feed retrieved successfully.', { posts, nextCursor });
    } catch (error) {
        next(error);
    }
};


/**
 * Adds a reaction to a post (upvote or flag).
 */
export const reactToPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;
    const { type } = req.body; // 'upvote' or 'flag'

    if (!userId) {
      return ApiResponse.error(res, 401, 'You must be logged in to react.');
    }

    if (type === 'flag') {
      await ModerationService.flagContentForReview('post', postId, 'user_report');
      return ApiResponse.success(res, 200, 'Post has been flagged for review.');
    }

    if (type === 'upvote') {
      // Prevent duplicate upvotes
      const existingReaction = await Reaction.findOne({ postId, userId, type: 'upvote' });
      if (existingReaction) {
        return ApiResponse.error(res, 409, 'You have already upvoted this post.');
      }
      
      const reaction = await Reaction.create({ postId, userId, type: 'upvote' });
      
      // Broadcast the reaction update
      getIO().of('/feed').emit('post:reaction', { postId, type: 'upvote' });

      return ApiResponse.success(res, 201, 'Post upvoted.', reaction);
    }
    
    return ApiResponse.error(res, 400, 'Invalid reaction type.');
  } catch (error) {
    next(error);
  }
};
