"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const salesSchema = new mongoose_1.Schema({
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Pedido' },
    paymentId: { type: String },
    amount: { type: Number },
    aditional: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'cash' },
    currency: { type: String },
    status: { type: String, default: 'paid' },
    slug: { type: String }
}, {
    timestamps: true
});
salesSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
salesSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('Sales', salesSchema);
