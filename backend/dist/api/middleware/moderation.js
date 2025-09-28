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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderationMiddleware = void 0;
const moderation_utils_1 = require("../../utils/moderation.utils");
const ApiResponse = __importStar(require("../../utils/apiResponse"));
/**
 * An Express middleware that intercepts user-generated content before it is saved.
 * It checks for banned keywords and masks profanity, ensuring a safer community.
 */
const moderationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // The content could be in 'body' (for posts) or 'content' (for submissions)
    const content = req.body.body || req.body.content;
    // If there's no content to moderate, just move on to the next step.
    if (!content) {
        return next();
    }
    // --- 1. Hard-Block Check for Severe Violations ---
    // We check the content against our list of banned keywords.
    const hasBannedWord = moderation_utils_1.BANNED_KEYWORDS.some(word => content.toLowerCase().includes(word));
    if (hasBannedWord) {
        // If a banned word is found, we immediately reject the request
        // with a clear error message and do not proceed further.
        return ApiResponse.error(res, 403, 'Content violates community safety guidelines and cannot be posted.');
    }
    // --- 2. Profanity Masking ---
    // We modify the request body directly. The controller will receive the sanitized version.
    if (req.body.body) {
        req.body.body = (0, moderation_utils_1.maskProfanity)(req.body.body);
    }
    if (req.body.content) {
        req.body.content = (0, moderation_utils_1.maskProfanity)(req.body.content);
    }
    // --- 3. Proceed to Controller ---
    // If all safety checks pass, we call next() to pass the (potentially modified)
    // request on to the actual route handler (the controller).
    next();
});
exports.moderationMiddleware = moderationMiddleware;
