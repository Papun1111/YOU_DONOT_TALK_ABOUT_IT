import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../../services/auth.service';
import * as ApiResponse from '../../utils/apiResponse';
import { User } from '../models/User.model';

export const createAnonymousSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { secretPhrase } = req.body;
        const user = await AuthService.createAnonymousUser(secretPhrase);
        // @ts-ignore
        req.session.userId = user._id;
        return ApiResponse.success(res, 201, 'Anonymous identity created.', user);
    } catch (error) {
        next(error);
    }
};

export const restoreSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { publicName, secretPhrase } = req.body;
        const user = await AuthService.restoreUserBySecretPhrase(publicName, secretPhrase);
        if (user) {
            // @ts-ignore
            req.session.userId = user._id;
            return ApiResponse.success(res, 200, 'Session restored.', user);
        }
        return ApiResponse.error(res, 401, 'Invalid credentials.');
    } catch (error) {
        next(error);
    }
};

/**
 * Gets the current user's data if a valid session exists.
 * This is the function that handles the GET /api/auth/me request.
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        if (!req.session?.userId) {
            return ApiResponse.error(res, 401, 'No active session.');
        }

        // @ts-ignore
        const user = await User.findById(req.session.userId).lean();
        if (!user) {
            return ApiResponse.error(res, 401, 'User not found.');
        }

        return ApiResponse.success(res, 200, 'Session is active.', user);
    } catch (error) {
        next(error);
    }
};

/**
 * Logs the user out by destroying the session.
 */
export const logout = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        return ApiResponse.success(res, 200, 'Successfully logged out.');
    });
};

