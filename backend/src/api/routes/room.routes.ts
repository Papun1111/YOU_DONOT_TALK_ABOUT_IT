/**
 * @fileoverview Routes for accessing rooms and their associated challenges.
 */
import { Router } from 'express';
import * as RoomController from '../controllers/room.controller';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

// Route to get a list of all available rooms
// GET /api/rooms
router.get('/', generalLimiter, RoomController.getAllRooms);

// Route to get all active challenges within a specific room
// GET /api/rooms/:roomId/challenges
router.get('/:roomId/challenges', generalLimiter, RoomController.getRoomChallenges);

export default router;
