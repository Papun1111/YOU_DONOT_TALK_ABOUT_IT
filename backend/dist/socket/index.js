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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocketServer = void 0;
/**
 * @fileoverview Main setup for the Socket.IO server, including authentication and namespaces.
 */
const socket_io_1 = require("socket.io");
const Logger = __importStar(require("../utils/logger"));
const config_1 = require("../config");
const session_1 = require("../api/middleware/session"); // This will be created in the middleware step
// A global variable to hold the io instance so it can be accessed from other parts of the app.
let io;
/**
 * Initializes the Socket.IO server and attaches it to the HTTP server.
 * @param {http.Server} httpServer - The main HTTP server instance from Express.
 * @returns {Server} The configured Socket.IO server instance.
 */
const initSocketServer = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: config_1.CORS_ORIGIN,
            credentials: true,
        },
    });
    // --- Middleware for Authentication ---
    // This allows Socket.IO to use the same session middleware as Express.
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
    io.use(wrap(session_1.sessionMiddleware));
    // This second middleware checks for a valid userId in the session after the session is parsed.
    io.use((socket, next) => {
        var _a;
        if ((_a = socket.request.session) === null || _a === void 0 ? void 0 : _a.userId) {
            // Attach the userId to the socket object for easy access in event handlers.
            socket.data.userId = socket.request.session.userId;
            next();
        }
        else {
            Logger.warn('Socket connection rejected: No valid session.', 'SocketAuth');
            next(new Error('Authentication error: Unauthorized.'));
        }
    });
    // --- Namespace for the Live Feed ---
    const feedNamespace = io.of('/feed');
    feedNamespace.on('connection', (socket) => {
        Logger.info(`User ${socket.data.userId} connected to the feed`, 'SocketFeed');
        // Here you could have users join specific rooms, e.g., socket.join('room:the-basement');
        socket.on('disconnect', () => {
            Logger.info(`User ${socket.data.userId} disconnected from the feed`, 'SocketFeed');
        });
    });
    // --- Namespace for the Leaderboard ---
    const leaderboardNamespace = io.of('/leaderboard');
    leaderboardNamespace.on('connection', (socket) => {
        Logger.info(`User ${socket.data.userId} connected to the leaderboard`, 'SocketLeaderboard');
        socket.on('disconnect', () => {
            Logger.info(`User ${socket.data.userId} disconnected from the leaderboard`, 'SocketLeaderboard');
        });
    });
    Logger.info('Socket.IO server initialized with authentication.', 'SocketIO');
    return io;
};
exports.initSocketServer = initSocketServer;
/**
 * A getter function to access the initialized Socket.IO server instance from anywhere in the app.
 * This is crucial for emitting events from controllers and services.
 * @returns {Server} The Socket.IO server instance.
 * @throws {Error} If the socket server has not been initialized yet.
 */
const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized! Call initSocketServer first.');
    }
    return io;
};
exports.getIO = getIO;
