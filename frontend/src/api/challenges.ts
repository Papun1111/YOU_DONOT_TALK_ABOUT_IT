import apiClient from './apiClient';
import type{ Challenge, Submission, ApiResponse } from '../types';

/**
 * Fetches all active challenges for a specific room.
 * @param roomId - The ID of the room.
 */
export const getChallengesForRoom = async (roomId: string): Promise<Challenge[]> => {
  const response = await apiClient.get<ApiResponse<Challenge[]>>(`/rooms/${roomId}/challenges`);
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
