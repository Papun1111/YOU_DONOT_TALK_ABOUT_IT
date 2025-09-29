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
exports.getIO = exports.initSocketServer = void 0;
/**
 * @fileoverview Main setup for the Socket.IO server, including authentication and all real-time namespaces.
 */
const socket_io_1 = require("socket.io");
const Logger = __importStar(require("../utils/logger"));
const config_1 = require("../config");
const session_1 = require("../api/middleware/session");
const ScoringService = __importStar(require("../services/scoring.service")); // For awarding points
// A global variable to hold the io instance so it can be accessed from other parts of the app.
let io;
/**
 * Initializes the Socket.IO server and attaches it to the HTTP server.
 * @param {http.Server} httpServer - The main HTTP server instance from Express.
 */
const initSocketServer = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: config_1.CORS_ORIGIN,
            credentials: true,
        },
    });
    // --- Middleware for Authentication ---
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
    io.use(wrap(session_1.sessionMiddleware));
    io.use((socket, next) => {
        var _a;
        if ((_a = socket.request.session) === null || _a === void 0 ? void 0 : _a.userId) {
            socket.data.userId = socket.request.session.userId;
            next();
        }
        else {
            Logger.warn('Socket connection rejected: No valid session.', 'SocketAuth');
            next(new Error('Authentication error: Unauthorized.'));
        }
    });
    // --- Existing Namespace: Live Feed (Unaffected) ---
    const feedNamespace = io.of('/feed');
    feedNamespace.on('connection', (socket) => {
        Logger.info(`User ${socket.data.userId} connected to the feed`, 'SocketFeed');
        socket.on('disconnect', () => {
            Logger.info(`User ${socket.data.userId} disconnected from the feed`, 'SocketFeed');
        });
    });
    // --- Existing Namespace: Leaderboard (Unaffected) ---
    const leaderboardNamespace = io.of('/leaderboard');
    leaderboardNamespace.on('connection', (socket) => {
        Logger.info(`User ${socket.data.userId} connected to the leaderboard`, 'SocketLeaderboard');
        socket.on('disconnect', () => {
            Logger.info(`User ${socket.data.userId} disconnected from the leaderboard`, 'SocketLeaderboard');
        });
    });
    // --- NEW Namespace: Live Challenge Interaction ---
    const challengeNamespace = io.of('/challenge');
    challengeNamespace.on('connection', (socket) => {
        Logger.info(`User ${socket.data.userId} connected to challenges`, 'SocketChallenge');
        // Event for any user (Master or Challenger) to join a specific room's socket channel
        socket.on('room:join', (roomId) => {
            socket.join(roomId);
            Logger.info(`User ${socket.data.userId} (Socket ID: ${socket.id}) joined room channel: ${roomId}`, 'SocketChallenge');
        });
        // --- Challenger Events ---
        socket.on('challenger:ready_for_dare', ({ roomId, user }) => {
            // Notify everyone in the room (specifically the Room Master) that a challenger is ready.
            socket.to(roomId).emit('master:challenger_is_ready', { user, challengerSocketId: socket.id });
        });
        socket.on('challenger:submit_dare', ({ roomId, responseText, user }) => {
            // Send the challenger's response back to the Room Master for review.
            socket.to(roomId).emit('master:receive_dare_response', { user, responseText });
        });
        // --- Room Master Events ---
        socket.on('master:send_dare', ({ roomId, dareText, challengerSocketId }) => {
            // Send the custom dare from the master specifically to the waiting challenger.
            io.to(challengerSocketId).emit('challenger:receive_dare', { dareText });
        });
        socket.on('master:grant_points', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, score, challengerUserId, challengeId }) {
            try {
                // Backend logic to create a formal submission and award points
                yield ScoringService.awardDarePoints(challengerUserId, challengeId, score);
                // Notify everyone in the room (including the challenger) of the success.
                io.to(roomId).emit('room:dare_success', {
                    message: `Welcome to the group. ${score} points awarded to user ${challengerUserId}.`,
                    challengerUserId
                });
                Logger.info(`Points granted to ${challengerUserId} in room ${roomId}`, 'SocketChallenge');
            }
            catch (error) {
                Logger.error('Failed to grant points via socket event.', error, 'SocketChallenge');
                // Optionally, emit an error event back to the Room Master's client
            }
        }));
        socket.on('disconnect', () => {
            Logger.info(`User ${socket.data.userId} disconnected from challenges`, 'SocketChallenge');
        });
    });
    Logger.info('Socket.IO server initialized with authentication.', 'SocketIO');
    return io;
};
exports.initSocketServer = initSocketServer;
/**
 * A getter function to access the initialized Socket.IO server instance from anywhere in the app.
 */
const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized! Call initSocketServer first.');
    }
    return io;
};
exports.getIO = getIO;
