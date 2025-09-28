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
exports.getRoomChallenges = exports.createRoom = exports.getAllRooms = void 0;
const Room_model_1 = require("../models/Room.model");
const Challenge_model_1 = require("../models/Challenge.model");
const ApiResponse = __importStar(require("../../utils/apiResponse"));
// ... getAllRooms and createRoom functions remain the same ...
const getAllRooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield Room_model_1.Room.find().sort({ createdAt: -1 });
        return ApiResponse.success(res, 200, 'Rooms retrieved successfully.', rooms);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRooms = getAllRooms;
const createRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, key } = req.body;
        if (!name || !description || !key) {
            return ApiResponse.error(res, 400, 'Name, description, and key are required.');
        }
        const existingRoom = yield Room_model_1.Room.findOne({ key });
        if (existingRoom) {
            return ApiResponse.error(res, 409, 'A room with this key already exists.');
        }
        const newRoom = new Room_model_1.Room({
            name,
            description,
            key,
            rules: ['Be respectful.', 'Content must adhere to safety guidelines.'],
            weights: { puzzle: 1.0, dare: 1.0, upvote: 1.0 },
        });
        yield newRoom.save();
        return ApiResponse.success(res, 201, 'Room created successfully.', newRoom);
    }
    catch (error) {
        next(error);
    }
});
exports.createRoom = createRoom;
/**
 * Fetches all active challenges for a specific room using its friendly key.
 */
const getRoomChallenges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomKey } = req.params;
        // Step 1: Find the room document using the human-readable key (e.g., "project-mayhem").
        const room = yield Room_model_1.Room.findOne({ key: roomKey });
        if (!room) {
            return ApiResponse.error(res, 404, 'Room not found.');
        }
        // Step 2: Use the valid database ObjectId from the found room to query for challenges.
        const challenges = yield Challenge_model_1.Challenge.find({ roomId: room._id, active: true }).lean();
        return ApiResponse.success(res, 200, 'Challenges retrieved successfully.', challenges);
    }
    catch (error) {
        next(error);
    }
});
exports.getRoomChallenges = getRoomChallenges;
