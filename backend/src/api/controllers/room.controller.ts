import { Request, Response, NextFunction } from 'express';
import { Room } from '../models/Room.model';
import { Challenge } from '../models/Challenge.model';
import * as ApiResponse from '../../utils/apiResponse';

// ... getAllRooms, getRoomByKey, getRoomChallenges functions remain the same ...
export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        return ApiResponse.success(res, 200, 'Rooms retrieved successfully.', rooms);
    } catch (error) {
        next(error);
    }
};

export const getRoomByKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomKey } = req.params;
        const room = await Room.findOne({ key: roomKey });
        if (!room) {
            return ApiResponse.error(res, 404, 'Room not found.');
        }
        return ApiResponse.success(res, 200, 'Room details retrieved.', room);
    } catch (error) {
        next(error);
    }
};

export const getRoomChallenges = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomKey } = req.params;
        const room = await Room.findOne({ key: roomKey });
        if (!room) {
            return ApiResponse.error(res, 404, 'Room not found.');
        }
        const challenges = await Challenge.find({ roomId: room._id, active: true }).lean();
        return ApiResponse.success(res, 200, 'Challenges retrieved successfully.', challenges);
    } catch (error) {
        next(error);
    }
};


/**
 * Creates a new room and assigns the current user as the owner.
 */
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // --- FIX STARTS HERE ---
        // 1. Get the authenticated user's ID from their session.
        // @ts-ignore
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to create a room.');
        }

        const { name, description, key } = req.body;

        if (!name || !description || !key) {
            return ApiResponse.error(res, 400, 'Name, description, and key are required.');
        }

        const existingRoom = await Room.findOne({ key });
        if (existingRoom) {
            return ApiResponse.error(res, 409, 'A room with this key already exists.');
        }

        // 2. Add the ownerId when creating the new Room document.
        const newRoom = new Room({
            name,
            description,
            key,
            ownerId: userId, // This line fixes the error.
            rules: ['Be respectful.', 'Content must adhere to safety guidelines.'],
            weights: { puzzle: 1.0, dare: 1.0, upvote: 1.0 },
        });
        // --- FIX ENDS HERE ---

        await newRoom.save();

        return ApiResponse.success(res, 201, 'Room created successfully.', newRoom);

    } catch (error) {
        next(error);
    }
};

