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
exports.getRoomChallenges = exports.getAllRooms = void 0;
const Room_model_1 = require("../models/Room.model");
const Challenge_model_1 = require("../models/Challenge.model");
const ApiResponse = __importStar(require("../../utils/apiResponse"));
/**
 * Fetches all available rooms.
 */
const getAllRooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield Room_model_1.Room.find().sort({ createdAt: 1 });
        return ApiResponse.success(res, 200, 'Rooms retrieved successfully.', rooms);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRooms = getAllRooms;
/**
 * Fetches the active challenges for a specific room.
 */
const getRoomChallenges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const challenges = yield Challenge_model_1.Challenge.find({ roomId, active: true })
            .select('-correctIndex') // Never send the correct answer to the client
            .sort({ difficulty: 1 });
        return ApiResponse.success(res, 200, 'Active challenges for the room retrieved successfully.', challenges);
    }
    catch (error) {
        next(error);
    }
});
exports.getRoomChallenges = getRoomChallenges;
