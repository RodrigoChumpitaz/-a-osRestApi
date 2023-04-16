"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const detallePedidoSchema = new mongoose_1.Schema({
    Cart: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Carta' },
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Pedido' },
    quantity: { type: Number, default: 1 },
    slug: { type: String }
}, {
    timestamps: true,
    versionKey: false
});
detallePedidoSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
detallePedidoSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('DetallePedido', detallePedidoSchema);
