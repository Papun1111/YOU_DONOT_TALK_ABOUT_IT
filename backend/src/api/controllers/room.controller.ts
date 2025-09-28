/**
 * @fileoverview Controller for handling rooms and their associated challenges.
 */
import { Request, Response, NextFunction } from 'express';
import { Room } from '../models/Room.model';
import { Challenge } from '../models/Challenge.model';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * Fetches all available rooms.
 */
export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await Room.find().sort({ createdAt: 1 });
    return ApiResponse.success(res, 200, 'Rooms retrieved successfully.', rooms);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetches the active challenges for a specific room.
 */
export const getRoomChallenges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const challenges = await Challenge.find({ roomId, active: true })
      .select('-correctIndex') // Never send the correct answer to the client
      .sort({ difficulty: 1 });
      
    return ApiResponse.success(res, 200, 'Active challenges for the room retrieved successfully.', challenges);
  } catch (error) {
    next(error);
  }
};
