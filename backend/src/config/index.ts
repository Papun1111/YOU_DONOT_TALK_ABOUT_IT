/**
 * @fileoverview Loads and validates environment variables from the .env file.
 * This is the single source of truth for all configuration.
 * The server will exit if any required variable is missing.
 */
import dotenv from 'dotenv';
import * as Logger from '../utils/logger';

// Load environment variables from .env file
dotenv.config();

/**
 * Validates and retrieves an environment variable.
 * @param {string} name - The name of the environment variable.
 * @param {string} [defaultValue] - An optional default value.
 * @returns {string} The value of the environment variable.
 * @throws {Error} if the variable is not found and no default is provided.
 */
const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (value === undefined) {
    Logger.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
};

// --- Exported Configuration Constants ---

export const NODE_ENV = getEnvVar('NODE_ENV', 'production');
export const PORT = parseInt(getEnvVar('PORT', '4000'), 10);
export const MONGO_URI = getEnvVar('MONGO_URI');
export const SESSION_SECRET = getEnvVar('SESSION_SECRET');
export const CORS_ORIGIN = getEnvVar('CORS_ORIGIN');
export const PROFANITY_FILTER = getEnvVar('PROFANITY_FILTER', 'on');
