"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const documentTypeSchema = new mongoose_1.Schema({
    type: { type: String, required: true, trim: true },
    slug: { type: String, required: false, lowercase: true, trim: true }
}, {
    timestamps: true,
    versionKey: false
});
documentTypeSchema.pre('save', async function (next) {
    this.slug = this.generatedSlug();
    next();
});
documentTypeSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('DocumentType', documentTypeSchema);
