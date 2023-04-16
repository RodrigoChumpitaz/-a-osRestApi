"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const user_1 = __importDefault(require("../model/user"));
async function validate(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, env_1.environment.jwtSecret);
            req.user = await user_1.default.findById(decoded.id).select('-password -lastname -token -confirmado').populate('roles');
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
    if (!token)
        return res.status(403).json({ message: 'Invalid token' });
    next();
}
exports.default = validate;
