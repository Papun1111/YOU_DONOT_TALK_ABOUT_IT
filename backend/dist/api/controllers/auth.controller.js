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
exports.logout = exports.getCurrentUser = exports.restoreSession = exports.createAnonymousSession = void 0;
const AuthService = __importStar(require("../../services/auth.service"));
const ApiResponse = __importStar(require("../../utils/apiResponse"));
const User_model_1 = require("../models/User.model");
/**
 * Creates a new anonymous user session.
 */
const createAnonymousSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { secretPhrase } = req.body;
        const user = yield AuthService.createAnonymousUser(secretPhrase);
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
    }
    catch (error) {
        next(error);
    }
});
exports.createAnonymousSession = createAnonymousSession;
/**
 * Restores a user session using a public name and secret phrase.
 */
const restoreSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicName, secretPhrase } = req.body;
        if (!publicName || !secretPhrase) {
            return ApiResponse.error(res, 400, 'Public name and secret phrase are required.');
        }
        const user = yield AuthService.restoreUserBySecretPhrase(publicName, secretPhrase);
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
    }
    catch (error) {
        next(error);
    }
});
exports.restoreSession = restoreSession;
/**
 * Gets the current authenticated user's data.
 */
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session.userId) {
            return ApiResponse.error(res, 401, 'Not authenticated.');
        }
        const user = yield User_model_1.User.findById(req.session.userId).select('publicName publicAvatar hiddenName hiddenAvatar');
        if (!user) {
            // This can happen if the user was deleted but the session persists
            req.session.destroy(() => { });
            return ApiResponse.error(res, 401, 'User not found.');
        }
        return ApiResponse.success(res, 200, 'Current user data fetched.', user);
    }
    catch (error) {
        next(error);
    }
});
exports.getCurrentUser = getCurrentUser;
/**
 * Logs the user out by destroying the session.
 */
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        return ApiResponse.success(res, 200, 'Logout successful.');
    });
};
exports.logout = logout;
