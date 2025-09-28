/**
 * @fileoverview Service layer for handling user authentication and identity logic.
 */
import bcrypt from 'bcrypt';
import { User, IUser } from '../api/models/User.model.js'; // Note: User model will be created in a later step.
import { generatePseudonym, generateAvatar } from '../utils/identityGenerator';
import * as Logger from '../utils/logger';

/**
 * Creates a new anonymous user with unique public and hidden identities.
 * @param {string} [secretPhrase] - An optional secret phrase for account recovery.
 * @returns {Promise<IUser>} The newly created user document.
 */
export const createAnonymousUser = async (secretPhrase?: string): Promise<IUser> => {
  const publicName = generatePseudonym();
  const hiddenName = generatePseudonym(); // Ensure this is also unique in production

  const userPayload: Partial<IUser> = {
    publicName,
    hiddenName,
    publicAvatar: generateAvatar(publicName),
    hiddenAvatar: generateAvatar(hiddenName),
  };

  if (secretPhrase) {
    const saltRounds = 10;
    userPayload.secretPhraseHash = await bcrypt.hash(secretPhrase, saltRounds);
  }

  const newUser = new User(userPayload);
  await newUser.save();

  Logger.info(`New anonymous user created: ${newUser.publicName}`, 'AuthService');
  return newUser;
};

/**
 * Finds a user by their public name and restores their session if the secret phrase is correct.
 * @param {string} publicName - The user's public-facing name.
 * @param {string} secretPhrase - The secret phrase to verify.
 * @returns {Promise<IUser | null>} The user document if successful, otherwise null.
 */
export const restoreUserBySecretPhrase = async (publicName: string, secretPhrase: string): Promise<IUser | null> => {
  // Find user and explicitly select the secretPhraseHash which is normally hidden.
  const user = await User.findOne({ publicName }).select('+secretPhraseHash');

  if (!user || !user.secretPhraseHash) {
    Logger.warn(`Restore attempt failed for "${publicName}": User or secret phrase hash not found.`, 'AuthService');
    return null;
  }

  const isMatch = await bcrypt.compare(secretPhrase, user.secretPhraseHash);

  if (isMatch) {
    Logger.info(`Successfully restored session for: ${publicName}`, 'AuthService');
    return user;
  }

  Logger.warn(`Restore attempt failed for "${publicName}": Invalid secret phrase.`, 'AuthService');
  return null;
};
export function findUserBySecretPhrase(secretPhrase: any) {
    throw new Error('Function not implemented.');
}

