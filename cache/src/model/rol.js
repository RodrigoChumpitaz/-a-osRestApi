"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rolSchema = new mongoose_1.Schema({
    rol: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Permission',
            required: true
        }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = (0, mongoose_1.model)('Rol', rolSchema);
