"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const localSchema = new mongoose_1.Schema({
    telefono: { type: String, require: true, length: 9, unique: true },
    direccion: { type: String, require: true, default: 'Sin dirección' },
    distrito: {
        id: String,
        slug: String,
        name: String
    },
    slug: { type: String, unique: true },
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});
localSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
localSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('Local', localSchema);
