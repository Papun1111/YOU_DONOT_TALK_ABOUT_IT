"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictLimiter = exports.generalLimiter = void 0;
/**
 * @fileoverview Configures rate limiting rules to prevent API abuse.
 */
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * A general rate limiter for most API routes.
 * Limits each IP to 100 requests per 15 minutes.
 */
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes.',
});
/**
 * A stricter rate limiter for sensitive actions like creating posts or submissions.
 * Limits each IP to 10 requests per minute to prevent spam.
 */
exports.strictLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'You are submitting content too quickly. Please wait a moment before trying again.',
});
