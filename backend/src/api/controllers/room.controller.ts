import { Request, Response, NextFunction } from 'express';
import { Room } from '../models/Room.model';
import { Challenge } from '../models/Challenge.model';
import * as ApiResponse from '../../utils/apiResponse';

// ... getAllRooms and createRoom functions remain the same ...
export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        return ApiResponse.success(res, 200, 'Rooms retrieved successfully.', rooms);
    } catch (error) {
        next(error);
    }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, key } = req.body;
        if (!name || !description || !key) {
            return ApiResponse.error(res, 400, 'Name, description, and key are required.');
        }
        const existingRoom = await Room.findOne({ key });
        if (existingRoom) {
            return ApiResponse.error(res, 409, 'A room with this key already exists.');
        }
        const newRoom = new Room({
            name,
            description,
            key,
            rules: ['Be respectful.', 'Content must adhere to safety guidelines.'],
            weights: { puzzle: 1.0, dare: 1.0, upvote: 1.0 },
        });
        await newRoom.save();
        return ApiResponse.success(res, 201, 'Room created successfully.', newRoom);
    } catch (error) {
        next(error);
    }
};


/**
 * Fetches all active challenges for a specific room using its friendly key.
 */
export const getRoomChallenges = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomKey } = req.params;
        
        // Step 1: Find the room document using the human-readable key (e.g., "project-mayhem").
        const room = await Room.findOne({ key: roomKey });

        if (!room) {
            return ApiResponse.error(res, 404, 'Room not found.');
        }

        // Step 2: Use the valid database ObjectId from the found room to query for challenges.
        const challenges = await Challenge.find({ roomId: room._id, active: true }).lean();
        
        return ApiResponse.success(res, 200, 'Challenges retrieved successfully.', challenges);
    } catch (error) {
        next(error);
    }
};

