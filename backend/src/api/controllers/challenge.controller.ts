import { Request, Response, NextFunction } from 'express';
import { Challenge } from '../models/Challenge.model';
import { Submission } from '../models/Submission.model';
import { Room } from '../models/Room.model'; // Import the Room model for the ownership check
import * as ScoringService from '../../services/scoring.service';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * Creates a new challenge for a specific room.
 * Only the owner of the room is permitted to perform this action.
 */
export const createChallenge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore - Get the authenticated user's ID from the session
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'Authentication required.');
        }

        const { roomId, type, title, prompt, options, correctIndex, difficulty } = req.body;

        // 1. Find the room the challenge will be added to.
        const room = await Room.findById(roomId);
        if (!room) {
            return ApiResponse.error(res, 404, 'Room not found.');
        }

        // 2. Security Check: Verify that the current user is the owner of the room.
        if (room.ownerId.toString() !== userId) {
            return ApiResponse.error(res, 403, 'Forbidden: You are not the owner of this room.');
        }
        
        // 3. Create the new challenge document.
        const newChallenge = new Challenge({
            roomId,
            type,
            title,
            prompt,
            options,
            correctIndex,
            difficulty,
            active: true // New challenges are active by default
        });

        // 4. Save to the database.
        await newChallenge.save();

        return ApiResponse.success(res, 201, 'Challenge created successfully.', newChallenge);
    } catch (error) {
        next(error);
    }
};


/**
 * Submits an answer for a specific challenge.
 */
export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to submit an answer.');
        }

        const { challengeId } = req.params;
        const { content, timeMs } = req.body;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return ApiResponse.error(res, 404, 'Challenge not found.');
        }

        let scoreResult;

        if (challenge.type === 'puzzle') {
            const selectedOptionIndex = parseInt(content, 10);
            const isCorrect = selectedOptionIndex === challenge.correctIndex;
            //@ts-ignore
            scoreResult = ScoringService.calculatePuzzleScore(challenge.difficulty, timeMs, isCorrect);
        } else { // 'dare' type
            // Dare score is initially 0, points are added later via upvotes.
            scoreResult = ScoringService.calculateDareScore(0);
        }
        
        const newSubmission = new Submission({
            userId,
            challengeId,
            content,
            timeMs,
            //@ts-ignore
            isCorrect: scoreResult.isCorrect,
            //@ts-ignore
            scoreDelta: scoreResult.scoreDelta,
        });

        await newSubmission.save();
        
        return ApiResponse.success(res, 201, 'Submission successful.', newSubmission);
    } catch (error) {
        next(error);
    }
};

