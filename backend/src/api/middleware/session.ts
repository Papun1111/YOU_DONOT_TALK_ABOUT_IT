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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax',
    },
});

// Augment the express-session module to add our custom userId property
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

