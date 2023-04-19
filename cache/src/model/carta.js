"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const cartaSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/defaultfoodImage.png' },
    category: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true }
    },
    slug: { type: String },
    available: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
cartaSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
cartaSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('Carta', cartaSchema);
