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
exports.submitAnswer = exports.createChallenge = void 0;
const Challenge_model_1 = require("../models/Challenge.model");
const Submission_model_1 = require("../models/Submission.model");
const Room_model_1 = require("../models/Room.model"); // Import the Room model for the ownership check
const ScoringService = __importStar(require("../../services/scoring.service"));
const ApiResponse = __importStar(require("../../utils/apiResponse"));
/**
 * Creates a new challenge for a specific room.
 * Only the owner of the room is permitted to perform this action.
 */
const createChallenge = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore - Get the authenticated user's ID from the session
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'Authentication required.');
        }
        const { roomId, type, title, prompt, options, correctIndex, difficulty } = req.body;
        // 1. Find the room the challenge will be added to.
        const room = yield Room_model_1.Room.findById(roomId);
        if (!room) {
            return ApiResponse.error(res, 404, 'Room not found.');
        }
        // 2. Security Check: Verify that the current user is the owner of the room.
        if (room.ownerId.toString() !== userId) {
            return ApiResponse.error(res, 403, 'Forbidden: You are not the owner of this room.');
        }
        // 3. Create the new challenge document.
        const newChallenge = new Challenge_model_1.Challenge({
            roomId,
            type,
            title,
            prompt,
            options,
            correctIndex,
            difficulty,
            active: true // New challenges are active by default
        });
        // 4. Save to the database.
        yield newChallenge.save();
        return ApiResponse.success(res, 201, 'Challenge created successfully.', newChallenge);
    }
    catch (error) {
        next(error);
    }
});
exports.createChallenge = createChallenge;
/**
 * Submits an answer for a specific challenge.
 */
const submitAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.session.userId;
        if (!userId) {
            return ApiResponse.error(res, 401, 'You must be logged in to submit an answer.');
        }
        const { challengeId } = req.params;
        const { content, timeMs } = req.body;
        const challenge = yield Challenge_model_1.Challenge.findById(challengeId);
        if (!challenge) {
            return ApiResponse.error(res, 404, 'Challenge not found.');
        }
        let scoreResult;
        if (challenge.type === 'puzzle') {
            const selectedOptionIndex = parseInt(content, 10);
            const isCorrect = selectedOptionIndex === challenge.correctIndex;
            //@ts-ignore
            scoreResult = ScoringService.calculatePuzzleScore(challenge.difficulty, timeMs, isCorrect);
        }
        else { // 'dare' type
            // Dare score is initially 0, points are added later via upvotes.
            scoreResult = ScoringService.calculateDareScore(0);
        }
        const newSubmission = new Submission_model_1.Submission({
            userId,
            challengeId,
            content,
            timeMs,
            //@ts-ignore
            isCorrect: scoreResult.isCorrect,
            //@ts-ignore
            scoreDelta: scoreResult.scoreDelta,
        });
        yield newSubmission.save();
        return ApiResponse.success(res, 201, 'Submission successful.', newSubmission);
    }
    catch (error) {
        next(error);
    }
});
exports.submitAnswer = submitAnswer;
