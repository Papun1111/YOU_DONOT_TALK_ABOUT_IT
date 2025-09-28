/**
 * @fileoverview Global error handling middleware.
 * Catches all errors from the routers and sends a standardized JSON response.
 */
import { Request, Response, NextFunction } from 'express';
import * as ApiResponse from '../../utils/apiResponse';
import * as Logger from '../../utils/logger';

/**
 * Catches and processes errors.
 * This should be the last piece of middleware added to the Express app.
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Check if headers have already been sent to the client. If so, pass the error to the default Express handler.
  if (res.headersSent) {
    return next(err);
  }

  Logger.error(`An unhandled error occurred: ${err.message}`, err, 'ErrorHandler');

  // In a production environment, you would add more sophisticated error handling here
  // to check for specific error types (e.g., validation errors, auth errors) and
  // return appropriate status codes and messages.

  // For this project, we return a generic 500 Internal Server Error for any unhandled exception.
  return ApiResponse.error(res, 500, 'An unexpected error occurred on the server. Please try again later.');
};

