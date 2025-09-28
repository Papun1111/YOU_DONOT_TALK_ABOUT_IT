import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post.model';
import { getIO } from '../../socket';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * Fetches the latest posts for the feed.
 */
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { room } = req.query;
    const query = room ? { roomId: room as string } : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'publicName publicAvatar') // This gets the user data
      .lean();

    // FIX: The database returns the populated user data in the 'userId' field.
    // We must rename it to 'user' to match what the frontend's AnonPost component expects.
    const postsWithUserField = posts.map(post => {
        const { userId, ...rest } = post;
        // @ts-ignore
        return { ...rest, user: userId };
    });

    return ApiResponse.success(res, 200, 'Feed retrieved successfully.', postsWithUserField);
  } catch (error) {
    next(error);
  }
};


export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const userId = req.session.userId;
        const { body, roomId } = req.body;

        if (!body || !roomId) {
            return ApiResponse.error(res, 400, 'Post body and roomId are required.');
        }

        let newPost = new Post({ userId, body, roomId });
        await newPost.save();

        newPost = await newPost.populate('userId', 'publicName publicAvatar');
        
        const postResponse = newPost.toObject();
        // @ts-ignore
        postResponse.user = postResponse.userId;
        // @ts-ignore
        delete postResponse.userId;

        getIO().of('/feed').emit('feed:new_post', postResponse);

        return ApiResponse.success(res, 201, 'Post created successfully.', postResponse);
    } catch (error) {
        next(error);
    }
};

export const reactToPost = async (req: Request, res: Response, next: NextFunction) => {
   // Dummy function for now
   return ApiResponse.success(res, 200, 'Reacted successfully.');
};

