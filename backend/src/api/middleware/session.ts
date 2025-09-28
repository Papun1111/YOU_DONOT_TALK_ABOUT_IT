/**
 * @fileoverview Configures and exports the express-session middleware.
 * This is used for both HTTP requests and Socket.IO authentication.
 */
import session from 'express-session';
// This side-effect import is required for TypeScript to correctly augment the module.
import 'express-session';
import { SESSION_SECRET } from '../../config';

// Augment the express-session SessionData interface to include our userId.
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Don't save a session until something is stored
  cookie: {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  },
});

