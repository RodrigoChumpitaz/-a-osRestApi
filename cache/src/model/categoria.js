"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const categoriaSchema = new mongoose_1.Schema({
    description: { type: String, required: true, unique: true },
    slug: { type: String },
    imgUrl: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/defaultfoodImage.png' },
    state: { type: Boolean, required: true, default: true }
}, {
    timestamps: true,
});
categoriaSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
categoriaSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('Categoria', categoriaSchema);
