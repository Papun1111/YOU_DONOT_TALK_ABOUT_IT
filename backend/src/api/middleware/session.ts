import session from 'express-session';
import MongoStore from 'connect-mongo';
import { SESSION_SECRET, MONGO_URI } from '../../config';
import 'express-session'; // Required for module augmentation

// This is the new, production-ready configuration.
export const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: MONGO_URI,
        collectionName: 'sessions', // Optional: name of the collection to store sessions in
        ttl: 14 * 24 * 60 * 60 // = 14 days. Default is 14 days.
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        
        // --- PRODUCTION FIXES ---
        // 1. `secure: true` tells the browser to ONLY send the cookie over HTTPS.
        //    This is CRITICAL for production. Your backend MUST be served over HTTPS for this to work.
        secure: process.env.NODE_ENV === 'production',

        // 2. `sameSite: 'none'` is required for cross-domain cookies (when your frontend and backend
        //    are on different domains). This MUST be used with `secure: true`.
        //    For local development (`http`), we keep it as 'lax'.
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
});

// Augment the express-session module to add our custom userId property
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

