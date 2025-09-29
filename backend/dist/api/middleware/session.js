"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const config_1 = require("../../config");
require("express-session"); // Required for module augmentation
// This is the new, production-ready configuration.
exports.sessionMiddleware = (0, express_session_1.default)({
    secret: config_1.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: config_1.MONGO_URI,
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
