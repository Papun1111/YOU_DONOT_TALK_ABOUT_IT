"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
/**
 * @fileoverview Configures and exports the express-session middleware.
 * This is used for both HTTP requests and Socket.IO authentication.
 */
const express_session_1 = __importDefault(require("express-session"));
// This side-effect import is required for TypeScript to correctly augment the module.
require("express-session");
const config_1 = require("../../config");
exports.sessionMiddleware = (0, express_session_1.default)({
    secret: config_1.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Don't save a session until something is stored
    cookie: {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
    },
});
