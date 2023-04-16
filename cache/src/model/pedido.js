"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const create_strings_1 = require("../helpers/create-strings");
const pedidoSchema = new mongoose_1.Schema({
    deliveryDate: { type: Date, required: true, default: Date.now() },
    slug: { type: String },
    imgPrueba: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/default-image-order.png' },
    observation: { type: String, default: 'Sin detalles ni observaciones' },
    status: { type: String, required: true, default: 'Pendiente' },
    saleType: { type: String, required: true },
    client: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        slug: { type: String, required: true }
    },
    orderDetail: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'DetallePedido' }],
}, {
    timestamps: true,
    versionKey: false
});
pedidoSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = this.generatedSlug();
    }
    next();
});
pedidoSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
exports.default = (0, mongoose_1.model)('Pedido', pedidoSchema);
