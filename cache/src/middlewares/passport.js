"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const env_1 = require("../config/env");
const user_1 = __importDefault(require("../model/user"));
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env_1.environment.jwtSecret
};
exports.default = new passport_jwt_1.Strategy(opts, async (payload, done) => {
    try {
        const user = await user_1.default.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        console.log(error);
    }
});
