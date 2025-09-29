/**
 * @fileoverview Main setup for the Socket.IO server, including authentication and all real-time namespaces.
 */
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import * as Logger from '../utils/logger';
import { CORS_ORIGIN } from '../config';
import { sessionMiddleware } from '../api/middleware/session';
import * as ScoringService from '../services/scoring.service'; // For awarding points

// A global variable to hold the io instance so it can be accessed from other parts of the app.
let io: Server;

/**
 * Initializes the Socket.IO server and attaches it to the HTTP server.
 * @param {http.Server} httpServer - The main HTTP server instance from Express.
 */
export const initSocketServer = (httpServer: ReturnType<typeof createServer>): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGIN,
      credentials: true,
    },
  });

  // --- Middleware for Authentication ---
  const wrap = (middleware: any) => (socket: Socket, next: (err?: any) => void) =>
    middleware(socket.request, {}, next);
  io.use(wrap(sessionMiddleware));

  io.use((socket: any, next) => {
    if (socket.request.session?.userId) {
      socket.data.userId = socket.request.session.userId;
      next();
    } else {
      Logger.warn('Socket connection rejected: No valid session.', 'SocketAuth');
      next(new Error('Authentication error: Unauthorized.'));
    }
  });

  // --- Existing Namespace: Live Feed (Unaffected) ---
  const feedNamespace = io.of('/feed');
  feedNamespace.on('connection', (socket: Socket) => {
    Logger.info(`User ${socket.data.userId} connected to the feed`, 'SocketFeed');
    socket.on('disconnect', () => {
      Logger.info(`User ${socket.data.userId} disconnected from the feed`, 'SocketFeed');
    });
  });

  // --- Existing Namespace: Leaderboard (Unaffected) ---
  const leaderboardNamespace = io.of('/leaderboard');
  leaderboardNamespace.on('connection', (socket: Socket) => {
    Logger.info(`User ${socket.data.userId} connected to the leaderboard`, 'SocketLeaderboard');
    socket.on('disconnect', () => {
      Logger.info(`User ${socket.data.userId} disconnected from the leaderboard`, 'SocketLeaderboard');
    });
  });

  // --- NEW Namespace: Live Challenge Interaction ---
  const challengeNamespace = io.of('/challenge');
  challengeNamespace.on('connection', (socket: Socket) => {
    Logger.info(`User ${socket.data.userId} connected to challenges`, 'SocketChallenge');

    // Event for any user (Master or Challenger) to join a specific room's socket channel
    socket.on('room:join', (roomId: string) => {
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
    
    socket.on('master:grant_points', async ({ roomId, score, challengerUserId, challengeId }) => {
        try {
            // Backend logic to create a formal submission and award points
            await ScoringService.awardDarePoints(challengerUserId, challengeId, score);
            
            // Notify everyone in the room (including the challenger) of the success.
            io.to(roomId).emit('room:dare_success', {
                message: `Welcome to the group. ${score} points awarded to user ${challengerUserId}.`,
                challengerUserId
            });
            Logger.info(`Points granted to ${challengerUserId} in room ${roomId}`, 'SocketChallenge');

        } catch (error) {
            Logger.error('Failed to grant points via socket event.', error, 'SocketChallenge');
            // Optionally, emit an error event back to the Room Master's client
        }
    });

    socket.on('disconnect', () => {
      Logger.info(`User ${socket.data.userId} disconnected from challenges`, 'SocketChallenge');
    });
  });


  Logger.info('Socket.IO server initialized with authentication.', 'SocketIO');
  return io;
};

/**
 * A getter function to access the initialized Socket.IO server instance from anywhere in the app.
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized! Call initSocketServer first.');
  }
  return io;
};

