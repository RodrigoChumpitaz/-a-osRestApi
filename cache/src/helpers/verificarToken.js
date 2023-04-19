"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const user_1 = __importDefault(require("../model/user"));
class Verificar {
    async verificarToken(req) {
        let isEjecutor = false;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.environment.jwtSecret);
        let user = await user_1.default.findOne({ email: decoded.email }).select('-password -lastname').populate('roles');
        user.roles.forEach((rol) => {
            if (rol.rol === 'moderator' || rol.rol === 'admin') {
                isEjecutor = true;
            }
        });
        return isEjecutor;
    }
    async isAdmin(req) {
        let isAdmin = false;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.environment.jwtSecret);
        let user = await user_1.default.findOne({ email: decoded.email }).select('-password -lastname').populate('roles');
        user.roles.forEach((rol) => {
            if (rol.rol === 'admin') {
                isAdmin = true;
            }
        });
        return isAdmin;
    }
    async decodeToken(token) {
        // const token: any = req.headers.user_token;
        const decoded = jsonwebtoken_1.default.verify(token, env_1.environment.jwtSecret);
        const user = await user_1.default.findById(decoded.id).select('-password -lastname -documentType -documentNumber -password -address -token -confirmed -roles -createdAt -updatedAt');
        return user;
    }
}
exports.default = Verificar;
