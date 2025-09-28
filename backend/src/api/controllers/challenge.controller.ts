import { Request, Response, NextFunction } from 'express';
import { Challenge } from '../models/Challenge.model';
import { Submission } from '../models/Submission.model';
import * as ScoringService from '../../services/scoring.service';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * Submits an answer for a specific challenge, ensuring the user is authenticated.
 */
export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // --- AUTHENTICATION CHECK ---
        // @ts-ignore
        const userId = req.session?.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to submit a challenge.');
        }

        const { challengeId } = req.params;
        const { content, timeMs } = req.body;

        // Validate required fields
        if (!challengeId) {
            return ApiResponse.error(res, 400, 'Challenge ID is required.');
        }

        if (!content && content !== 0) { // Allow 0 as valid content for option index
            return ApiResponse.error(res, 400, 'Answer content is required.');
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return ApiResponse.error(res, 404, 'Challenge not found.');
        }

        let scoreResult: { scoreDelta: number; isCorrect?: boolean };

        // Calculate score based on the type of challenge
        if (challenge.type === 'puzzle') {
            // Validate timeMs for puzzles
            if (typeof timeMs !== 'number' || timeMs < 0) {
                return ApiResponse.error(res, 400, 'Valid time in milliseconds is required for puzzles.');
            }

            const selectedOptionIndex = parseInt(content, 10);
            
            // Validate the selected option index
            if (isNaN(selectedOptionIndex) || selectedOptionIndex < 0 || selectedOptionIndex >= (challenge.options?.length || 0)) {
                return ApiResponse.error(res, 400, 'Invalid option selected.');
            }

            const isCorrect = selectedOptionIndex === challenge.correctIndex;
            
            try {
                // @ts-ignore
                scoreResult = ScoringService.calculatePuzzleScore(challenge.difficulty, timeMs, isCorrect);
            } catch (scoringError) {
                console.error('Scoring service error:', scoringError);
                return ApiResponse.error(res, 500, 'Error calculating score.');
            }
        } else if (challenge.type === 'dare') {
            // Validate content for dares (should be text)
            if (typeof content !== 'string' || content.trim().length === 0) {
                return ApiResponse.error(res, 400, 'Dare response cannot be empty.');
            }
            
            // On initial submission, a dare has a score of 0.
            // Points are awarded later via upvotes on the feed.
            scoreResult = { scoreDelta: 0, isCorrect: undefined };
        } else {
            return ApiResponse.error(res, 400, 'Invalid challenge type.');
        }
        
        // Create the submission document
        const submissionData: any = {
            userId,
            challengeId,
            //@ts-ignore
            content: challenge.type === 'puzzle' ? selectedOptionIndex : content,
            scoreDelta: scoreResult.scoreDelta,
        };

        // Only include timeMs for puzzles
        if (challenge.type === 'puzzle') {
            submissionData.timeMs = timeMs;
            submissionData.isCorrect = scoreResult.isCorrect;
        }

        const newSubmission = new Submission(submissionData);
        await newSubmission.save();
        
        return ApiResponse.success(res, 201, 'Submission successful.', newSubmission);
    } catch (error) {
        console.error('Submit answer error:', error);
        next(error);
    }
};