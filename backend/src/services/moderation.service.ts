/**
 * @fileoverview Service for handling content moderation workflows.
 */
import { ModerationQueue } from '../api/models/ModerationQueue.model';
import { Post } from '../api/models/Post.model';
import { Submission } from '../api/models/Submission.model';
import * as Logger from '../utils/logger';

type ItemType = 'post' | 'submission';

/**
 * Creates a new item in the moderation queue for review.
 * This is called when a user reports content or automated systems flag it.
 * @param {ItemType} itemType - The type of content being flagged ('post' or 'submission').
 * @param {string} itemId - The ID of the content document.
 * @param {string} reason - The reason for flagging (e.g., 'hate_speech', 'user_report').
 * @returns {Promise<void>}
 */
export const flagContentForReview = async (itemType: ItemType, itemId: string, reason: string): Promise<void> => {
  await ModerationQueue.create({
    itemType,
    itemId,
    reason,
    status: 'pending',
  });
  Logger.info(`Content [${itemId}] of type [${itemType}] was flagged for: ${reason}`, 'ModerationService');
};

/**
 * Processes a moderation queue item. (Admin action)
 * @param {string} queueId - The ID of the ModerationQueue document.
 * @param {'approved' | 'removed'} decision - The moderator's decision.
 * @returns {Promise<boolean>} True if the action was successful.
 */
export const reviewFlaggedContent = async (queueId: string, decision: 'approved' | 'removed'): Promise<boolean> => {
  const queueItem = await ModerationQueue.findById(queueId);
  if (!queueItem || queueItem.status !== 'pending') {
    Logger.warn(`Moderation item ${queueId} not found or already reviewed.`, 'ModerationService');
    return false;
  }
  
  if (decision === 'removed') {
    // FIX: Use a conditional block to call the update method on the specific model.
    // This resolves the TypeScript error by removing the ambiguous union type call.
    if (queueItem.itemType === 'post') {
      // Assuming a schema field like `isRemoved: boolean` for soft deletion.
      await Post.findByIdAndUpdate(queueItem.itemId, { $set: { isRemoved: true } });
    } else {
      await Submission.findByIdAndUpdate(queueItem.itemId, { $set: { isRemoved: true } });
    }
    Logger.info(`Content ${queueItem.itemId} removed based on review.`, 'ModerationService');
  }

  // Update the queue item itself.
  queueItem.status = decision;
  queueItem.reviewedAt = new Date();
  await queueItem.save();

  return true;
};

