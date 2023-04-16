"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const connect = async () => {
    try {
        mongoose_1.default.set("strictQuery", true);
        await mongoose_1.default.connect(`mongodb+srv://${env_1.environment.USER}:${env_1.environment.PASSWORD}@${env_1.environment.CLUSTER_NAME}.dw9jl.mongodb.net/${env_1.environment.DATABASE_NAME}?retryWrites=true&w=majority`);
        console.log(`Connect to ${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        console.log(error);
        mongoose_1.default.disconnect();
    }
};
exports.connect = connect;
