/**
 * @fileoverview Controller for handling user authentication and sessions.
 */
import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../../services/auth.service';
import * as ApiResponse from '../../utils/apiResponse';
import { User } from '../models/User.model';

/**
 * Creates a new anonymous user session.
 */
export const createAnonymousSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { secretPhrase } = req.body;
    const user = await AuthService.createAnonymousUser(secretPhrase);

    // Set the user ID in the session
    //@ts-ignore
    req.session.userId = user._id.toString();

    // Return only the public-facing data
    const publicUserData = {
      _id: user._id,
      publicName: user.publicName,
      publicAvatar: user.publicAvatar,
    };

    return ApiResponse.success(res, 201, 'Anonymous session created successfully.', publicUserData);
  } catch (error) {
    next(error);
  }
};

/**
 * Restores a user session using a public name and secret phrase.
 */
export const restoreSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { publicName, secretPhrase } = req.body;
    if (!publicName || !secretPhrase) {
      return ApiResponse.error(res, 400, 'Public name and secret phrase are required.');
    }

    const user = await AuthService.restoreUserBySecretPhrase(publicName, secretPhrase);
    if (!user) {
      return ApiResponse.error(res, 401, 'Invalid public name or secret phrase.');
    }
//@ts-ignore
    req.session.userId = user._id.toString();
    
    const publicUserData = {
      _id: user._id,
      publicName: user.publicName,
      publicAvatar: user.publicAvatar,
    };

    return ApiResponse.success(res, 200, 'Session restored successfully.', publicUserData);
  } catch (error) {
    next(error);
  }
};

/**
 * Gets the current authenticated user's data.
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.userId) {
      return ApiResponse.error(res, 401, 'Not authenticated.');
    }
    const user = await User.findById(req.session.userId).select('publicName publicAvatar hiddenName hiddenAvatar');
    if (!user) {
      // This can happen if the user was deleted but the session persists
      req.session.destroy(() => {});
      return ApiResponse.error(res, 401, 'User not found.');
    }
    return ApiResponse.success(res, 200, 'Current user data fetched.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Logs the user out by destroying the session.
 */
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    return ApiResponse.success(res, 200, 'Logout successful.');
  });
};

