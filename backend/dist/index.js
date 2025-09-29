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
/**
 * @fileoverview The main entry point for the Digital Fight Club backend server.
 */
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const Logger = __importStar(require("./utils/logger"));
// Middleware Imports
const session_1 = require("./api/middleware/session");
const rateLimiter_1 = require("./api/middleware/rateLimiter");
const errorHandler_1 = require("./api/middleware/errorHandler");
// Route and Socket Imports
const routes_1 = __importDefault(require("./api/routes"));
const socket_1 = require("./socket"); // Updated import
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    app.set('trust proxy', 1);
    // --- Core Middleware Setup ---
    app.use((0, cors_1.default)({
        origin: config_1.CORS_ORIGIN,
        credentials: true,
    }));
    app.use(express_1.default.json()); // To parse JSON bodies
    app.use((0, cookie_parser_1.default)()); // To parse cookies
    app.use(session_1.sessionMiddleware); // Session management
    app.use(rateLimiter_1.generalLimiter); // Apply general rate limiting to all requests
    // --- API Routes ---
    app.use('/api', routes_1.default);
    // --- Global Error Handler ---
    // This must be the last piece of middleware added.
    app.use(errorHandler_1.errorHandler);
    try {
        // --- Database Connection ---
        yield (0, database_1.connectDB)();
        // --- WebSocket (Socket.IO) Setup ---
        // Initialize using the new dedicated function.
        (0, socket_1.initSocketServer)(httpServer);
        // --- Start Listening ---
        httpServer.listen(config_1.PORT, () => {
            Logger.info(`Server is running and listening on http://localhost:${config_1.PORT}`);
            Logger.info('Connected to MongoDB and Socket.IO is initialized.');
        });
    }
    catch (err) {
        Logger.error('Failed to start the server.', err);
        process.exit(1);
    }
});
startServer();
