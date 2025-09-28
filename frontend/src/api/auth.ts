import apiClient from './apiClient';
import type { User, ApiResponse } from '../types';

/**
 * Creates a new anonymous session.
 * @param secretPhrase - An optional secret phrase for account recovery.
 */
export const createAnonymousSession = async (secretPhrase?: string): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>('/auth/anonymous', { secretPhrase });
  return response.data.data;
};

/**
 * Checks if a valid session exists with the server.
 * This is used on app load to see if the user is already logged in.
 */
export const checkSession = async (): Promise<User> => {
    // A dedicated '/auth/me' endpoint is a common pattern for this.
    // It should return the user object if the session cookie is valid.
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
};

/**
 * Restores a user session using their public name and secret phrase.
 */
export const restoreSession = async (publicName: string, secretPhrase: string): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/restore', { publicName, secretPhrase });
    return response.data.data;
};

/**
 * Logs the user out by invalidating the session on the backend.
 */
export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};
