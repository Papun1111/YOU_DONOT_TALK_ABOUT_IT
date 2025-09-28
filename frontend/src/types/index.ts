/**
 * @fileoverview Single source of truth for all TypeScript types and interfaces.
 * These types define the shape of data flowing from the backend API.
 */

// =================================================================
// API Response Wrappers
// =================================================================

/**
 * A standardized successful API response wrapper.
 */
export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

/**
 * A standardized error API response wrapper.
 */
export type ApiErrorResponse = {
  success: false;
  message: string;
  error?: unknown;
};

// =================================================================
// Core Data Models
// =================================================================

/**
 * Represents a User's public and hidden personas.
 * The client will typically only receive a subset of this on login.
 */
export type User = {
  _id: string;
  publicName: string;
  publicAvatar: string; // This will be a base64 encoded SVG string
  hiddenName: string;
  hiddenAvatar: string;
  createdAt: string; // ISO date string
};

/**
 * Represents a themed room within the application.
 */
export type Room = {
  _id: string;
  key: string; // e.g., 'the-basement'
  name: string;
  description: string;
  rules: string[];
  weights: {
    puzzle: number;
    dare: number;
    upvote: number;
  };
};

// --- Challenges (Discriminated Union) ---

/**
 * Base type for all challenges. The 'type' property is the discriminant.
 */
interface BaseChallenge {
  _id: string;
  roomId: string;
  title: string;
  prompt: string;
  difficulty: number; // e.g., 1 (easy) to 5 (hard)
  active: boolean;
  createdAt: string;
}

/**
 * A puzzle-type challenge with multiple-choice options.
 */
export interface PuzzleChallenge extends BaseChallenge {
  type: "puzzle";
  options: string[];
  // correctIndex is NOT sent to the client to prevent cheating.
}

/**
 * A writing dare-type challenge.
 */
export interface DareChallenge extends BaseChallenge {
  type: "dare";
}

/**
 * A union type representing any possible challenge.
 */
export type Challenge = PuzzleChallenge | DareChallenge;

/**
 * Represents a user's submission for a challenge.
 */
export type Submission = {
  _id: string;
  userId: string;
  challengeId: string;
  content: string; // The user's answer or dare text
  isCorrect?: boolean; // Only relevant for puzzles
  timeMs?: number; // Time taken in milliseconds
  scoreDelta: number; // The score awarded for this submission
  createdAt: string;
};

/**
 * Represents an anonymous post in the dark social feed.
 */
export type Post = {
  _id: string;
  userId: string;
  roomId: string;
  body: string;
  createdAt: string;
  hiddenSelfShown?: boolean;
  // User details are often populated by the backend for display
  user?: {
    publicName: string;
    publicAvatar: string;
  };
  reactionCount?: number; // Aggregated on the backend
};

/**
 * Represents a user's reaction to a post.
 */
export type Reaction = {
  _id: string;
  postId: string;
  userId: string;
  type: "upvote" | "flag";
};

// =================================================================
// Feature-Specific Types
// =================================================================

/**
 * Represents a single item on a leaderboard.
 */
export type LeaderboardItem = {
  userId: string;
  publicName: string;
  publicAvatar: string;
  score: number;
  rank: number;
};

/**
 * Represents the full leaderboard data structure.
 */
export type Leaderboard = {
  scope: "global" | "room";
  items: LeaderboardItem[];
};
