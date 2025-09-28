/**
 * @fileoverview The main entry point for the Digital Fight Club backend server.
 */
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PORT, CORS_ORIGIN } from './config';
import { connectDB } from './config/database';
import * as Logger from './utils/logger';

// Middleware Imports
import { sessionMiddleware } from './api/middleware/session';
import { generalLimiter } from './api/middleware/rateLimiter';
import { errorHandler } from './api/middleware/errorHandler';

// Route and Socket Imports
import apiRoutes from './api/routes';
import { initSocketServer } from './socket'; // Updated import

const startServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);

    // --- Core Middleware Setup ---
    app.use(cors({
        origin: CORS_ORIGIN,
        credentials: true,
    }));
    app.use(express.json()); // To parse JSON bodies
    app.use(cookieParser());   // To parse cookies
    app.use(sessionMiddleware); // Session management
    app.use(generalLimiter);   // Apply general rate limiting to all requests

    // --- API Routes ---
    app.use('/api', apiRoutes);
    
    // --- Global Error Handler ---
    // This must be the last piece of middleware added.
    app.use(errorHandler);

    try {
        // --- Database Connection ---
        await connectDB();

        // --- WebSocket (Socket.IO) Setup ---
        // Initialize using the new dedicated function.
        initSocketServer(httpServer);

        // --- Start Listening ---
        httpServer.listen(PORT, () => {
            Logger.info(`Server is running and listening on http://localhost:${PORT}`);
            Logger.info('Connected to MongoDB and Socket.IO is initialized.');
        });

    } catch (err) {
        Logger.error('Failed to start the server.', err);
        process.exit(1);
    }
};

startServer();

