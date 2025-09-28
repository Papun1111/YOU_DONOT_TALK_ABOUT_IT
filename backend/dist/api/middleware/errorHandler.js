"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiResponse = __importStar(require("../../utils/apiResponse"));
const Logger = __importStar(require("../../utils/logger"));
/**
 * Catches and processes errors.
 * This should be the last piece of middleware added to the Express app.
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
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
exports.errorHandler = errorHandler;
