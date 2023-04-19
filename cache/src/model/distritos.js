"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const distritoSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    slug: { type: String },
    active: { type: Boolean, default: true },
    locals: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Local' }]
}, {
    timestamps: true
});
distritoSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
distritoSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('Distrito', distritoSchema);
