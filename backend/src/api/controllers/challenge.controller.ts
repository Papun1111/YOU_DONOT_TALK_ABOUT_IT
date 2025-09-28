/**
 * @fileoverview Controller for handling challenge submissions.
 */
import { Request, Response, NextFunction } from 'express';
import { Challenge, IChallenge } from '../models/Challenge.model';
import { Submission } from '../models/Submission.model';
import * as ScoringService from '../../services/scoring.service';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * Handles a user's submission for a challenge (puzzle or dare).
 */
export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { challengeId } = req.params;
    const userId = req.session.userId;

    if (!userId) {
      return ApiResponse.error(res, 401, 'You must be logged in to submit.');
    }

    const { content, timeMs } = req.body; // `content` can be an answer index for puzzles or text for dares.

    const challenge = await Challenge.findById(challengeId);
    if (!challenge || !challenge.active) {
      return ApiResponse.error(res, 404, 'Challenge not found or is no longer active.');
    }

    let isCorrect: boolean | undefined = undefined;
    let scoreDelta = 0;

    // Use the appropriate scoring service based on the challenge type.
    if (challenge.type === 'puzzle') {
      // The correctness of the answer must be determined in the controller.
      isCorrect = challenge.correctIndex === Number(content);

      if (isCorrect) {
        // The service is called only for correct answers to calculate the score.
        // It expects primitive types, not the full challenge object.
        //@ts-ignore
        const puzzleResultScore = ScoringService.calculatePuzzleScore(challenge, Number(content), timeMs);
        scoreDelta = puzzleResultScore; // The service returns the score directly as a number.
      } else {
        scoreDelta = 0;
      }
    } else if (challenge.type === 'dare') {
      // Dares are not scored on submission. They gain points from peer upvotes later.
      isCorrect = undefined; // Not applicable for dares
      scoreDelta = 0;
    }

    // Create the submission record
    const submission = await Submission.create({
      userId,
      challengeId,
      content,
      timeMs,
      isCorrect,
      scoreDelta,
    });

    return ApiResponse.success(res, 200, 'Submission processed.', {
      isCorrect,
      scoreDelta,
      submissionId: submission._id,
    });
  } catch (error) {
    next(error);
  }
};

