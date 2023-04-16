"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const permissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Permission', permissionSchema);
