"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function createAuthToken(user) {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, roles: user.roles }, env_1.environment.jwtSecret, { expiresIn: '30d' });
}
exports.createAuthToken = createAuthToken;
function createRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ id: user._id }, env_1.environment.jwtSecret, { expiresIn: 7 * 24 * 60 * 60 * 1000 });
}
exports.createRefreshToken = createRefreshToken;
