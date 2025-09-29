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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFANITY_FILTER = exports.CORS_ORIGIN = exports.SESSION_SECRET = exports.MONGO_URI = exports.PORT = exports.NODE_ENV = void 0;
/**
 * @fileoverview Loads and validates environment variables from the .env file.
 * This is the single source of truth for all configuration.
 * The server will exit if any required variable is missing.
 */
const dotenv_1 = __importDefault(require("dotenv"));
const Logger = __importStar(require("../utils/logger"));
// Load environment variables from .env file
dotenv_1.default.config();
/**
 * Validates and retrieves an environment variable.
 * @param {string} name - The name of the environment variable.
 * @param {string} [defaultValue] - An optional default value.
 * @returns {string} The value of the environment variable.
 * @throws {Error} if the variable is not found and no default is provided.
 */
const getEnvVar = (name, defaultValue) => {
    const value = process.env[name] || defaultValue;
    if (value === undefined) {
        Logger.error(`Missing required environment variable: ${name}`);
        process.exit(1);
    }
    return value;
};
// --- Exported Configuration Constants ---
exports.NODE_ENV = getEnvVar('NODE_ENV', 'production');
exports.PORT = parseInt(getEnvVar('PORT', '4000'), 10);
exports.MONGO_URI = getEnvVar('MONGO_URI');
exports.SESSION_SECRET = getEnvVar('SESSION_SECRET');
exports.CORS_ORIGIN = getEnvVar('CORS_ORIGIN');
exports.PROFANITY_FILTER = getEnvVar('PROFANITY_FILTER', 'on');
