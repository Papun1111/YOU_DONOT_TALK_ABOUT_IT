/**
 * @fileoverview Service for calculating scores and creating submissions for challenges.
 * This centralizes all scoring logic.
 */
import { Submission } from '../api/models/Submission.model';

// --- Constants for Scoring Logic ---
const PUZZLE_BASE_MULTIPLIER = 100;
const DARE_UPVOTE_WEIGHT = 5;

/**
 * Calculates the score for a puzzle submission.
 * @param difficulty - The difficulty rating of the puzzle.
 * @param timeMs - The time the user took in milliseconds.
 * @param isCorrect - Whether the user's answer was correct.
 * @returns An object with the final score and correctness.
 */
export const calculatePuzzleScore = (difficulty: number, timeMs: number, isCorrect: boolean) => {
    if (!isCorrect) {
        return { scoreDelta: 0, isCorrect: false };
    }
    // A simple scoring logic for puzzles
    const baseScore = difficulty * PUZZLE_BASE_MULTIPLIER;
    const timeBonus = Math.max(0, 15000 - timeMs) / 100; // Bonus for speed
    return { scoreDelta: Math.round(baseScore + timeBonus), isCorrect: true };
};

/**
 * Calculates the initial score for a dare submission.
 * The score starts at 0 and is increased by upvotes later.
 * @param upvoteCount - The initial number of upvotes (usually 0).
 * @returns An object with the final score and correctness.
 */
export const calculateDareScore = (upvoteCount: number) => {
    return { scoreDelta: upvoteCount * DARE_UPVOTE_WEIGHT, isCorrect: true };
};

/**
 * Creates a submission record for a dare that was approved by a Room Master.
 * This is called from the socket handler when points are granted.
 * @param challengerUserId - The ID of the user who completed the dare.
 * @param challengeId - The ID of the dare challenge.
 * @param score - The amount of points awarded by the Room Master.
 */
export const awardDarePoints = async (challengerUserId: string, challengeId: string, score: number): Promise<void> => {
    const dareSubmission = new Submission({
        userId: challengerUserId,
        challengeId: challengeId,
        content: 'Dare completed and approved by Room Master.', // Placeholder content
        isCorrect: true,
        scoreDelta: score,
    });
    await dareSubmission.save();
};

