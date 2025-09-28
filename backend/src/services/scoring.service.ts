/**
 * @fileoverview Service for calculating scores for challenges and applying bonuses.
 * This centralizes all scoring logic.
 */

// --- Constants for Scoring Logic ---
const PUZZLE_BASE_MULTIPLIER = 100;
const DARE_UPVOTE_WEIGHT = 5;
const MAX_STREAK_BONUS_PERCENT = 0.5; // 50%
const STREAK_BONUS_PER_DAY_PERCENT = 0.1; // 10%

/**
 * Calculates the score for a puzzle submission based on difficulty and speed.
 * @param {number} difficulty - The difficulty rating of the puzzle (e.g., 1 to 10).
 * @param {number} timeLimitMs - The total time allowed for the puzzle in milliseconds.
 * @param {number} timeTakenMs - The time the user took to solve the puzzle in milliseconds.
 * @returns {number} The calculated score.
 */
export const calculatePuzzleScore = (difficulty: number, timeLimitMs: number, timeTakenMs: number): number => {
  if (timeTakenMs > timeLimitMs) return 0;

  const baseScore = difficulty * PUZZLE_BASE_MULTIPLIER;
  
  const timeRemainingSeconds = (timeLimitMs - timeTakenMs) / 1000;
  const speedBonus = Math.ceil(timeRemainingSeconds);
  
  return baseScore + speedBonus;
};

/**
 * Calculates the score for a dare submission based on community upvotes.
 * @param {number} upvoteCount - The number of upvotes received.
 * @returns {number} The calculated score.
 */
export const calculateDareScore = (upvoteCount: number): number => {
  return upvoteCount * DARE_UPVOTE_WEIGHT;
};

/**
 * Calculates a streak bonus multiplier based on the number of consecutive days active.
 * @param {number} streakDays - The number of consecutive days the user has been active.
 * @returns {number} The score multiplier (e.g., 1.0 for no bonus, 1.1 for 10% bonus).
 */
export const getStreakBonusMultiplier = (streakDays: number): number => {
  const bonus = Math.min(MAX_STREAK_BONUS_PERCENT, streakDays * STREAK_BONUS_PER_DAY_PERCENT);
  return 1 + bonus;
};
