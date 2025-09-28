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
exports.getRoomLeaderboard = exports.getGlobalLeaderboard = void 0;
const LeaderboardService = __importStar(require("../../services/leaderboard.service"));
const ApiResponse = __importStar(require("../../utils/apiResponse"));
/**
 * Gets the global leaderboard.
 */
const getGlobalLeaderboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // FIX: Changed to call the correct service function 'getGlobalLeaderboard'.
        const leaderboard = yield LeaderboardService.getGlobalLeaderboard();
        return ApiResponse.success(res, 200, 'Global leaderboard retrieved.', leaderboard);
    }
    catch (error) {
        next(error);
    }
});
exports.getGlobalLeaderboard = getGlobalLeaderboard;
/**
 * Gets the leaderboard for a specific room.
 */
const getRoomLeaderboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomKey } = req.params;
        // TODO: A 'getRoomLeaderboard' function needs to be implemented in leaderboard.service.ts.
        // The provided service file currently only supports a global leaderboard.
        // Returning an empty array as a placeholder.
        const leaderboard = [];
        // Once implemented, the call would look like this:
        // const leaderboard = await LeaderboardService.getRoomLeaderboard(roomKey);
        return ApiResponse.success(res, 200, `Leaderboard for room ${roomKey} retrieved.`, leaderboard);
    }
    catch (error) {
        next(error);
    }
});
exports.getRoomLeaderboard = getRoomLeaderboard;
