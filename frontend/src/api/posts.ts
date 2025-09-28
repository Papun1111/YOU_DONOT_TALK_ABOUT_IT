import apiClient from './apiClient';
import type{ Post, ApiResponse } from '../types';

/**
 * Fetches the latest posts for the feed.
 * @param roomId - Optional filter to get posts only from a specific room.
 */
export const getFeed = async (roomId?: string): Promise<Post[]> => {
  const params = roomId ? { room: roomId } : {};
  const response = await apiClient.get<ApiResponse<Post[]>>('/posts', { params });
  return response.data.data;
};

/**
 * Creates a new post in the feed.
 * @param body - The text content of the post.
 * @param roomId - The room the post belongs to.
 */
export const createPost = async (body: string, roomId: string): Promise<Post> => {
  const response = await apiClient.post<ApiResponse<Post>>('/posts', { body, roomId });
  return response.data.data;
};

/**
 * Sends a reaction (upvote or flag) for a post.
 * @param postId - The ID of the post to react to.
 * @param type - The type of reaction.
 */
export const reactToPost = async (postId: string, type: 'upvote' | 'flag'): Promise<void> => {
  await apiClient.post(`/posts/${postId}/react`, { type });
};
