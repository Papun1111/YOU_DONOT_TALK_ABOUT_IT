import apiClient from './apiClient';
import { type Room, type ApiResponse } from '../types';

/**
 * Fetches the list of all available rooms.
 */
export const getAllRooms = async (): Promise<Room[]> => {
    const response = await apiClient.get<ApiResponse<Room[]>>('/rooms');
    return response.data.data;
};

/**
 * Fetches a single room by its unique key.
 * This corresponds to the GET /api/rooms/:roomKey endpoint.
 */
export const getRoomByKey = async (roomKey: string): Promise<Room> => {
    const response = await apiClient.get<ApiResponse<Room>>(`/rooms/${roomKey}`);
    return response.data.data;
};


/**
 * Creates a new room.
 * @param name - The display name of the room.
 * @param description - A short description.
 */
export const createRoom = async (name: string, description: string): Promise<Room> => {
    // Generate a URL-friendly key from the name on the client-side.
    const key = name.toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')       // Replace spaces with -
                    .replace(/[^a-z0-9-]/g, ''); // Remove all non-alphanumeric characters except dashes

    const response = await apiClient.post<ApiResponse<Room>>('/rooms', { name, description, key });
    return response.data.data;
};

