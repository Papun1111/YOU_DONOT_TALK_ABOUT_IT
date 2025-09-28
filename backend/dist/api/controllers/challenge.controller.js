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
exports.submitAnswer = void 0;
const Challenge_model_1 = require("../models/Challenge.model");
const Submission_model_1 = require("../models/Submission.model");
const ScoringService = __importStar(require("../../services/scoring.service"));
const ApiResponse = __importStar(require("../../utils/apiResponse"));
/**
 * Submits an answer for a specific challenge, ensuring the user is authenticated.
 */
const submitAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // --- AUTHENTICATION CHECK ---
        // @ts-ignore
        const userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to submit a challenge.');
        }
        const { challengeId } = req.params;
        const { content, timeMs } = req.body;
        // Validate required fields
        if (!challengeId) {
            return ApiResponse.error(res, 400, 'Challenge ID is required.');
        }
        if (!content && content !== 0) { // Allow 0 as valid content for option index
            return ApiResponse.error(res, 400, 'Answer content is required.');
        }
        const challenge = yield Challenge_model_1.Challenge.findById(challengeId);
        if (!challenge) {
            return ApiResponse.error(res, 404, 'Challenge not found.');
        }
        let scoreResult;
        // Calculate score based on the type of challenge
        if (challenge.type === 'puzzle') {
            // Validate timeMs for puzzles
            if (typeof timeMs !== 'number' || timeMs < 0) {
                return ApiResponse.error(res, 400, 'Valid time in milliseconds is required for puzzles.');
            }
            const selectedOptionIndex = parseInt(content, 10);
            // Validate the selected option index
            if (isNaN(selectedOptionIndex) || selectedOptionIndex < 0 || selectedOptionIndex >= (((_b = challenge.options) === null || _b === void 0 ? void 0 : _b.length) || 0)) {
                return ApiResponse.error(res, 400, 'Invalid option selected.');
            }
            const isCorrect = selectedOptionIndex === challenge.correctIndex;
            try {
                // @ts-ignore
                scoreResult = ScoringService.calculatePuzzleScore(challenge.difficulty, timeMs, isCorrect);
            }
            catch (scoringError) {
                console.error('Scoring service error:', scoringError);
                return ApiResponse.error(res, 500, 'Error calculating score.');
            }
        }
        else if (challenge.type === 'dare') {
            // Validate content for dares (should be text)
            if (typeof content !== 'string' || content.trim().length === 0) {
                return ApiResponse.error(res, 400, 'Dare response cannot be empty.');
            }
            // On initial submission, a dare has a score of 0.
            // Points are awarded later via upvotes on the feed.
            scoreResult = { scoreDelta: 0, isCorrect: undefined };
        }
        else {
            return ApiResponse.error(res, 400, 'Invalid challenge type.');
        }
        // Create the submission document
        const submissionData = {
            userId,
            challengeId,
            //@ts-ignore
            content: challenge.type === 'puzzle' ? selectedOptionIndex : content,
            scoreDelta: scoreResult.scoreDelta,
        };
        // Only include timeMs for puzzles
        if (challenge.type === 'puzzle') {
            submissionData.timeMs = timeMs;
            submissionData.isCorrect = scoreResult.isCorrect;
        }
        const newSubmission = new Submission_model_1.Submission(submissionData);
        yield newSubmission.save();
        return ApiResponse.success(res, 201, 'Submission successful.', newSubmission);
    }
    catch (error) {
        console.error('Submit answer error:', error);
        next(error);
    }
});
exports.submitAnswer = submitAnswer;
