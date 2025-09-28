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
exports.reviewFlaggedContent = exports.flagContentForReview = void 0;
/**
 * @fileoverview Service for handling content moderation workflows.
 */
const ModerationQueue_model_1 = require("../api/models/ModerationQueue.model");
const Post_model_1 = require("../api/models/Post.model");
const Submission_model_1 = require("../api/models/Submission.model");
const Logger = __importStar(require("../utils/logger"));
/**
 * Creates a new item in the moderation queue for review.
 * This is called when a user reports content or automated systems flag it.
 * @param {ItemType} itemType - The type of content being flagged ('post' or 'submission').
 * @param {string} itemId - The ID of the content document.
 * @param {string} reason - The reason for flagging (e.g., 'hate_speech', 'user_report').
 * @returns {Promise<void>}
 */
const flagContentForReview = (itemType, itemId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    yield ModerationQueue_model_1.ModerationQueue.create({
        itemType,
        itemId,
        reason,
        status: 'pending',
    });
    Logger.info(`Content [${itemId}] of type [${itemType}] was flagged for: ${reason}`, 'ModerationService');
});
exports.flagContentForReview = flagContentForReview;
/**
 * Processes a moderation queue item. (Admin action)
 * @param {string} queueId - The ID of the ModerationQueue document.
 * @param {'approved' | 'removed'} decision - The moderator's decision.
 * @returns {Promise<boolean>} True if the action was successful.
 */
const reviewFlaggedContent = (queueId, decision) => __awaiter(void 0, void 0, void 0, function* () {
    const queueItem = yield ModerationQueue_model_1.ModerationQueue.findById(queueId);
    if (!queueItem || queueItem.status !== 'pending') {
        Logger.warn(`Moderation item ${queueId} not found or already reviewed.`, 'ModerationService');
        return false;
    }
    if (decision === 'removed') {
        // FIX: Use a conditional block to call the update method on the specific model.
        // This resolves the TypeScript error by removing the ambiguous union type call.
        if (queueItem.itemType === 'post') {
            // Assuming a schema field like `isRemoved: boolean` for soft deletion.
            yield Post_model_1.Post.findByIdAndUpdate(queueItem.itemId, { $set: { isRemoved: true } });
        }
        else {
            yield Submission_model_1.Submission.findByIdAndUpdate(queueItem.itemId, { $set: { isRemoved: true } });
        }
        Logger.info(`Content ${queueItem.itemId} removed based on review.`, 'ModerationService');
    }
    // Update the queue item itself.
    queueItem.status = decision;
    queueItem.reviewedAt = new Date();
    yield queueItem.save();
    return true;
});
exports.reviewFlaggedContent = reviewFlaggedContent;
