"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.success = void 0;
const success = (res, statusCode, message, data) => {
    const response = {
        success: true,
        message,
        data: data || null,
    };
    return res.status(statusCode).json(response);
};
exports.success = success;
/**
 * Sends a standardized error response.
 * @param {Response} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - A descriptive error message.
 * @param {any} [error] - The original error object (for logging, not for client).
 */
const error = (res, statusCode, message, error) => {
    const response = {
        success: false,
        message,
    };
    // In development, you might want to send the error stack.
    if (process.env.NODE_ENV === 'development' && error) {
        response.error = { message: error.message, stack: error.stack };
    }
    return res.status(statusCode).json(response);
};
exports.error = error;
