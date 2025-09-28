"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview The main router that aggregates all other route modules.
 */
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const room_routes_1 = __importDefault(require("./room.routes"));
const challenge_routes_1 = __importDefault(require("./challenge.routes"));
const post_routes_1 = __importDefault(require("./post.routes"));
const leaderboard_routes_1 = __importDefault(require("./leaderboard.routes"));
const router = (0, express_1.Router)();
// Mount the different resource routes under their respective paths.
router.use('/auth', auth_routes_1.default);
router.use('/rooms', room_routes_1.default);
router.use('/challenges', challenge_routes_1.default);
router.use('/posts', post_routes_1.default);
router.use('/leaderboard', leaderboard_routes_1.default);
exports.default = router;
