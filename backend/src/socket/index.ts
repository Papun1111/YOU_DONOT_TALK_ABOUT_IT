/**
 * @fileoverview Main setup for the Socket.IO server, including authentication and namespaces.
 */
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import * as Logger from '../utils/logger';
import { CORS_ORIGIN } from '../config';
import { sessionMiddleware } from '../api/middleware/session';// This will be created in the middleware step

// A global variable to hold the io instance so it can be accessed from other parts of the app.
let io: Server;

/**
 * Initializes the Socket.IO server and attaches it to the HTTP server.
 * @param {http.Server} httpServer - The main HTTP server instance from Express.
 * @returns {Server} The configured Socket.IO server instance.
 */
export const initSocketServer = (httpServer: ReturnType<typeof createServer>): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGIN,
      credentials: true,
    },
  });

  // --- Middleware for Authentication ---
  // This allows Socket.IO to use the same session middleware as Express.
  const wrap = (middleware: any) => (socket: Socket, next: (err?: any) => void) =>
    middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));

  // This second middleware checks for a valid userId in the session after the session is parsed.
  io.use((socket: any, next) => {
    if (socket.request.session?.userId) {
      // Attach the userId to the socket object for easy access in event handlers.
      socket.data.userId = socket.request.session.userId;
      next();
    } else {
      Logger.warn('Socket connection rejected: No valid session.', 'SocketAuth');
      next(new Error('Authentication error: Unauthorized.'));
    }
  });


  // --- Namespace for the Live Feed ---
  const feedNamespace = io.of('/feed');
  feedNamespace.on('connection', (socket: Socket) => {
    Logger.info(`User ${socket.data.userId} connected to the feed`, 'SocketFeed');

    // Here you could have users join specific rooms, e.g., socket.join('room:the-basement');

    socket.on('disconnect', () => {
      Logger.info(`User ${socket.data.userId} disconnected from the feed`, 'SocketFeed');
    });
  });


  // --- Namespace for the Leaderboard ---
  const leaderboardNamespace = io.of('/leaderboard');
  leaderboardNamespace.on('connection', (socket: Socket) => {
    Logger.info(`User ${socket.data.userId} connected to the leaderboard`, 'SocketLeaderboard');

    socket.on('disconnect', () => {
      Logger.info(`User ${socket.data.userId} disconnected from the leaderboard`, 'SocketLeaderboard');
    });
  });

  Logger.info('Socket.IO server initialized with authentication.', 'SocketIO');
  return io;
};

/**
 * A getter function to access the initialized Socket.IO server instance from anywhere in the app.
 * This is crucial for emitting events from controllers and services.
 * @returns {Server} The Socket.IO server instance.
 * @throws {Error} If the socket server has not been initialized yet.
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized! Call initSocketServer first.');
  }
  return io;
};
