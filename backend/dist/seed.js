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
const mongoose_1 = __importDefault(require("mongoose"));
const Room_model_1 = require("./api/models/Room.model");
const Challenge_model_1 = require("./api/models/Challenge.model");
const config_1 = require("./config");
const Logger = __importStar(require("./utils/logger"));
const roomsData = [
    {
        key: 'the-basement',
        name: 'The Basement',
        description: 'A place for the logical and the quick-witted. Solve timed brain teasers and logic puzzles to prove your mettle.',
        rules: ['Speed and accuracy are rewarded.', 'No collaboration.'],
        weights: { puzzle: 1.2, dare: 0, upvote: 0.5 },
    },
    {
        key: 'support-groups',
        name: 'Support Groups',
        description: 'A space for anonymous expression. Respond to writing dares and react to the thoughts of your peers.',
        rules: ['All posts are anonymous.', 'React with wit and boldness.', 'No downvotes.'],
        weights: { puzzle: 0, dare: 1.0, upvote: 1.5 },
    },
    {
        key: 'project-mayhem',
        name: 'Project Mayhem (Safe)',
        description: 'For those who see the patterns in the noise. Engage in ARG-style puzzle chains and uncover hidden clues.',
        rules: ['Think outside the box.', 'Clues are strictly in-app.', 'Some puzzles may require information from other rooms.'],
        weights: { puzzle: 1.5, dare: 0.8, upvote: 1.0 },
    },
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    Logger.info('Connecting to the database for seeding...', 'Seed');
    try {
        yield mongoose_1.default.connect(config_1.MONGO_URI);
        Logger.info('Database connected. Clearing existing data...', 'Seed');
        // 1. Clear previous data to ensure a fresh start
        yield Room_model_1.Room.deleteMany({});
        yield Challenge_model_1.Challenge.deleteMany({});
        Logger.info('Existing rooms and challenges cleared. Seeding new data...', 'Seed');
        // 2. Create rooms and get their newly generated database IDs
        const createdRooms = yield Room_model_1.Room.insertMany(roomsData);
        const basementRoom = createdRooms.find(r => r.key === 'the-basement');
        const supportRoom = createdRooms.find(r => r.key === 'support-groups');
        Logger.info(`Seeded ${createdRooms.length} rooms.`);
        // 3. Create challenges and link them to the new rooms using their IDs
        if (basementRoom && supportRoom) {
            const challengesData = [
                {
                    roomId: basementRoom._id,
                    type: 'puzzle',
                    title: 'The Riddle of the Eye',
                    prompt: 'I have an eye, but I am blind. I am sharp, but have no mind. What am I?',
                    options: ['A Storm', 'A Needle', 'A Potato', 'A Camera'],
                    correctIndex: 1,
                    difficulty: 2,
                    active: true,
                },
                {
                    roomId: supportRoom._id,
                    type: 'dare',
                    title: 'A Minor Confession',
                    prompt: 'Describe a time you got away with something trivial.',
                    difficulty: 3,
                    active: true,
                },
                {
                    roomId: basementRoom._id,
                    type: 'puzzle',
                    title: 'Forward I am Heavy',
                    prompt: 'Forward I am heavy, but backward I am not. What am I?',
                    options: ['A Scale', 'A Ton', 'A Shadow', 'An Anchor'],
                    correctIndex: 1,
                    difficulty: 3,
                    active: true,
                },
            ];
            yield Challenge_model_1.Challenge.insertMany(challengesData);
            Logger.info(`Seeded ${challengesData.length} challenges.`);
        }
        Logger.info('✅ Database seeded successfully!', 'Seed');
    }
    catch (error) {
        Logger.error('An error occurred during database seeding.', error, 'Seed');
    }
    finally {
        // 4. Always disconnect from the database when the script is done
        yield mongoose_1.default.disconnect();
        Logger.info('Database connection closed.', 'Seed');
    }
});
// Execute the function to run the seed script
seedDatabase();
