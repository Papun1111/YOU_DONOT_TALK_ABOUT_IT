/**
 * @fileoverview Routes for accessing and creating rooms.
 */
import { Router } from 'express';
import * as RoomController from '../controllers/room.controller';
import { generalLimiter, strictLimiter } from '../middleware/rateLimiter';

const router = Router();

// Route to get a list of all available rooms
// GET /api/rooms
router.get('/', generalLimiter, RoomController.getAllRooms);

// Route to create a new room
// POST /api/rooms
router.post('/', strictLimiter, RoomController.createRoom);

// Route to get all active challenges within a specific room
// GET /api/rooms/:roomId/challenges
router.get('/:roomId/challenges', generalLimiter, RoomController.getRoomChallenges);

export default router;

