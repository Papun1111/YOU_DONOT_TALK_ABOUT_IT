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
const createAnonymousSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { secretPhrase } = req.body;
        const user = yield AuthService.createAnonymousUser(secretPhrase);
        // @ts-ignore
        req.session.userId = user._id;
        return ApiResponse.success(res, 201, 'Anonymous identity created.', user);
    }
    catch (error) {
        next(error);
    }
});
exports.createAnonymousSession = createAnonymousSession;
const restoreSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicName, secretPhrase } = req.body;
        const user = yield AuthService.restoreUserBySecretPhrase(publicName, secretPhrase);
        if (user) {
            // @ts-ignore
            req.session.userId = user._id;
            return ApiResponse.success(res, 200, 'Session restored.', user);
        }
        return ApiResponse.error(res, 401, 'Invalid credentials.');
    }
    catch (error) {
        next(error);
    }
});
exports.restoreSession = restoreSession;
/**
 * Gets the current user's data if a valid session exists.
 * This is the function that handles the GET /api/auth/me request.
 */
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId)) {
            return ApiResponse.error(res, 401, 'No active session.');
        }
        // @ts-ignore
        const user = yield User_model_1.User.findById(req.session.userId).lean();
        if (!user) {
            return ApiResponse.error(res, 401, 'User not found.');
        }
        return ApiResponse.success(res, 200, 'Session is active.', user);
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
    // @ts-ignore
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid'); // The default session cookie name
        return ApiResponse.success(res, 200, 'Successfully logged out.');
    });
};
exports.logout = logout;
