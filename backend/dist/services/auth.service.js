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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreUserBySecretPhrase = exports.createAnonymousUser = void 0;
exports.findUserBySecretPhrase = findUserBySecretPhrase;
/**
 * @fileoverview Service layer for handling user authentication and identity logic.
 */
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_js_1 = require("../api/models/User.model.js"); // Note: User model will be created in a later step.
const identityGenerator_1 = require("../utils/identityGenerator");
const Logger = __importStar(require("../utils/logger"));
/**
 * Creates a new anonymous user with unique public and hidden identities.
 * @param {string} [secretPhrase] - An optional secret phrase for account recovery.
 * @returns {Promise<IUser>} The newly created user document.
 */
const createAnonymousUser = (secretPhrase) => __awaiter(void 0, void 0, void 0, function* () {
    const publicName = (0, identityGenerator_1.generatePseudonym)();
    const hiddenName = (0, identityGenerator_1.generatePseudonym)(); // Ensure this is also unique in production
    const userPayload = {
        publicName,
        hiddenName,
        publicAvatar: (0, identityGenerator_1.generateAvatar)(publicName),
        hiddenAvatar: (0, identityGenerator_1.generateAvatar)(hiddenName),
    };
    if (secretPhrase) {
        const saltRounds = 10;
        userPayload.secretPhraseHash = yield bcrypt_1.default.hash(secretPhrase, saltRounds);
    }
    const newUser = new User_model_js_1.User(userPayload);
    yield newUser.save();
    Logger.info(`New anonymous user created: ${newUser.publicName}`, 'AuthService');
    return newUser;
});
exports.createAnonymousUser = createAnonymousUser;
/**
 * Finds a user by their public name and restores their session if the secret phrase is correct.
 * @param {string} publicName - The user's public-facing name.
 * @param {string} secretPhrase - The secret phrase to verify.
 * @returns {Promise<IUser | null>} The user document if successful, otherwise null.
 */
const restoreUserBySecretPhrase = (publicName, secretPhrase) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user and explicitly select the secretPhraseHash which is normally hidden.
    const user = yield User_model_js_1.User.findOne({ publicName }).select('+secretPhraseHash');
    if (!user || !user.secretPhraseHash) {
        Logger.warn(`Restore attempt failed for "${publicName}": User or secret phrase hash not found.`, 'AuthService');
        return null;
    }
    const isMatch = yield bcrypt_1.default.compare(secretPhrase, user.secretPhraseHash);
    if (isMatch) {
        Logger.info(`Successfully restored session for: ${publicName}`, 'AuthService');
        return user;
    }
    Logger.warn(`Restore attempt failed for "${publicName}": Invalid secret phrase.`, 'AuthService');
    return null;
});
exports.restoreUserBySecretPhrase = restoreUserBySecretPhrase;
function findUserBySecretPhrase(secretPhrase) {
    throw new Error('Function not implemented.');
}
