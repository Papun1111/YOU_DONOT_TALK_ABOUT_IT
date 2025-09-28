/**
 * @fileoverview Configures rate limiting rules to prevent API abuse.
 */
import rateLimit from 'express-rate-limit';

/**
 * A general rate limiter for most API routes.
 * Limits each IP to 100 requests per 15 minutes.
 */
export const generalLimiter = rateLimit({
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
export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'You are submitting content too quickly. Please wait a moment before trying again.',
});
