/**
 * @fileoverview Controller for fetching leaderboard data.
 */
import { Request, Response, NextFunction } from 'express';
import * as LeaderboardService from '../../services/leaderboard.service';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * Gets the global leaderboard.
 */
export const getGlobalLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // FIX: Changed to call the correct service function 'getGlobalLeaderboard'.
    const leaderboard = await LeaderboardService.getGlobalLeaderboard();
    return ApiResponse.success(res, 200, 'Global leaderboard retrieved.', leaderboard);
  } catch (error) {
    next(error);
  }
};

/**
 * Gets the leaderboard for a specific room.
 */
export const getRoomLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomKey } = req.params;
    
    // TODO: A 'getRoomLeaderboard' function needs to be implemented in leaderboard.service.ts.
    // The provided service file currently only supports a global leaderboard.
    // Returning an empty array as a placeholder.
    const leaderboard: any[] = [];
    
    // Once implemented, the call would look like this:
    // const leaderboard = await LeaderboardService.getRoomLeaderboard(roomKey);
    
    return ApiResponse.success(res, 200, `Leaderboard for room ${roomKey} retrieved.`, leaderboard);
  } catch (error) {
    next(error);
  }
};

