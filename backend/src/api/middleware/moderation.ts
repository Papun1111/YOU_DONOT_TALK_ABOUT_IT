import { Request, Response, NextFunction } from 'express';
import { BANNED_KEYWORDS, maskProfanity } from '../../utils/moderation.utils';
import * as ApiResponse from '../../utils/apiResponse';

/**
 * An Express middleware that intercepts user-generated content before it is saved.
 * It checks for banned keywords and masks profanity, ensuring a safer community.
 */
export const moderationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // The content could be in 'body' (for posts) or 'content' (for submissions)
    const content: string | undefined = req.body.body || req.body.content;

    // If there's no content to moderate, just move on to the next step.
    if (!content) {
        return next();
    }

    // --- 1. Hard-Block Check for Severe Violations ---
    // We check the content against our list of banned keywords.
    const hasBannedWord = BANNED_KEYWORDS.some(word => content.toLowerCase().includes(word));
    if (hasBannedWord) {
        // If a banned word is found, we immediately reject the request
        // with a clear error message and do not proceed further.
        return ApiResponse.error(res, 403, 'Content violates community safety guidelines and cannot be posted.');
    }

    // --- 2. Profanity Masking ---
    // We modify the request body directly. The controller will receive the sanitized version.
    if (req.body.body) {
        req.body.body = maskProfanity(req.body.body);
    }
    if (req.body.content) {
        req.body.content = maskProfanity(req.body.content);
    }
    
    // --- 3. Proceed to Controller ---
    // If all safety checks pass, we call next() to pass the (potentially modified)
    // request on to the actual route handler (the controller).
    next();
};

