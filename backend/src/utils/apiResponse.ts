/**
 * @fileoverview Standardized response handlers for the Express API.
 * This ensures consistency and simplifies controller logic.
 */
import { Response } from 'express';

/**
 * Interface for a standardized successful API response.
 */
interface IApiResponse<T> {
  success: true;
  message: string;
  data: T | null;
}

export const success = <T>(res: Response, statusCode: number, message: string, data?: T) => {
  const response: IApiResponse<T | undefined> = {
    success: true,
    message,
    data: data || null,
  };
  return res.status(statusCode).json(response);
};

/**
 * Interface for a standardized error API response.
 */
interface IErrorResponse {
  success: false;
  message: string;
  error?: any;
}

/**
 * Sends a standardized error response.
 * @param {Response} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - A descriptive error message.
 * @param {any} [error] - The original error object (for logging, not for client).
 */
export const error = (res: Response, statusCode: number, message: string, error?: any) => {
  const response: IErrorResponse = {
    success: false,
    message,
  };
  // In development, you might want to send the error stack.
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = { message: error.message, stack: error.stack };
  }
  return res.status(statusCode).json(response);
};

