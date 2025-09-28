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
 * Handles a user's submission for a challenge (puzzle or dare).
 */
const submitAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { challengeId } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to submit.');
        }
        const { content, timeMs } = req.body; // `content` can be an answer index for puzzles or text for dares.
        const challenge = yield Challenge_model_1.Challenge.findById(challengeId);
        if (!challenge || !challenge.active) {
            return ApiResponse.error(res, 404, 'Challenge not found or is no longer active.');
        }
        let isCorrect = undefined;
        let scoreDelta = 0;
        // Use the appropriate scoring service based on the challenge type.
        if (challenge.type === 'puzzle') {
            // The correctness of the answer must be determined in the controller.
            isCorrect = challenge.correctIndex === Number(content);
            if (isCorrect) {
                // The service is called only for correct answers to calculate the score.
                // It expects primitive types, not the full challenge object.
                //@ts-ignore
                const puzzleResultScore = ScoringService.calculatePuzzleScore(challenge, Number(content), timeMs);
                scoreDelta = puzzleResultScore; // The service returns the score directly as a number.
            }
            else {
                scoreDelta = 0;
            }
        }
        else if (challenge.type === 'dare') {
            // Dares are not scored on submission. They gain points from peer upvotes later.
            isCorrect = undefined; // Not applicable for dares
            scoreDelta = 0;
        }
        // Create the submission record
        const submission = yield Submission_model_1.Submission.create({
            userId,
            challengeId,
            content,
            timeMs,
            isCorrect,
            scoreDelta,
        });
        return ApiResponse.success(res, 200, 'Submission processed.', {
            isCorrect,
            scoreDelta,
            submissionId: submission._id,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.submitAnswer = submitAnswer;
