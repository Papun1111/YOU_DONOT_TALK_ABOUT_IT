import apiClient from './apiClient';
import type{ Challenge, Submission, ApiResponse } from '../types';

/**
 * Fetches all active challenges for a specific room using its friendly key.
 * @param roomKey - The key of the room (e.g., 'the-basement').
 */
export const getChallengesForRoom = async (roomKey: string): Promise<Challenge[]> => {
  const response = await apiClient.get<ApiResponse<Challenge[]>>(`/rooms/${roomKey}/challenges`);
  return response.data.data;
};

/**
 * Creates a new challenge for a room. This can only be done by the room's owner.
 * @param challengeData - The data for the new challenge (type, title, prompt, etc.).
 */
export const createChallenge = async (challengeData: Partial<Challenge>): Promise<Challenge> => {
    const response = await apiClient.post<ApiResponse<Challenge>>('/challenges', challengeData);
    return response.data.data;
};

/**
 * Submits a user's answer for a puzzle or a dare.
 * @param challengeId - The ID of the challenge being submitted.
 * @param content - The user's answer or dare text.
 * @param timeMs - The time taken in milliseconds (for puzzles).
 */
export const submitChallenge = async (
  challengeId: string,
  content: string,
  timeMs?: number
): Promise<Submission> => {
  const payload = { content, timeMs };
  const response = await apiClient.post<ApiResponse<Submission>>(
    `/challenges/${challengeId}/submit`,
    payload
  );
  return response.data.data;
};

