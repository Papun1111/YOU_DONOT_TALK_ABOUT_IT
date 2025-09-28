"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = void 0;
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
};
const getTimestamp = () => new Date().toLocaleTimeString();
const info = (message, namespace = 'Server') => {
    console.log(`${colors.cyan}[${namespace}]${colors.reset} ${getTimestamp()} ${colors.green}[INFO]${colors.reset} ${message}`);
};
exports.info = info;
const warn = (message, namespace = 'Server') => {
    console.log(`${colors.cyan}[${namespace}]${colors.reset} ${getTimestamp()} ${colors.yellow}[WARN]${colors.reset} ${message}`);
};
exports.warn = warn;
const error = (message, error, namespace = 'Server') => {
    console.error(`${colors.cyan}[${namespace}]${colors.reset} ${getTimestamp()} ${colors.red}[ERROR]${colors.reset} ${message}`);
    if (error) {
        console.error(error);
    }
};
exports.error = error;
