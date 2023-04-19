"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
// import yenv from "yenv";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const env = yenv();
exports.environment = {
    jwtSecret: process.env.jwtSecret || "secretKey",
    PORT: process.env.PORT || 4000,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    CLUSTER_NAME: process.env.CLUSTER_NAME,
    DATABASE_NAME: process.env.DATABASE_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    BOT_EMAIL: process.env.BOT_EMAIL,
    BOT_PASS: process.env.BOT_PASS,
};
