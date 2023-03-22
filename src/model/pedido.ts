import { Schema, model } from "mongoose";
import { IPedido } from "../interfaces/pedido.interface";
import { getSlug } from "../helpers/create-strings";

const pedidoSchema = new Schema({
    deliveryDate: { type: Date, required: true, default: Date.now() },
    slug: { type: String },
    imgPrueba: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/default-image-order.png' },
    observation: { type: String, default: 'Sin detalles ni observaciones' },
    status: { type: String, required: true, default: 'Pendiente' },
    client: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        slug: { type: String, required: true}
    },
    orderDetail: [{ type: Schema.Types.ObjectId, ref: 'DetallePedido' }],
},{
    timestamps: true,
    versionKey: false
})

pedidoSchema.pre<IPedido>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
})

pedidoSchema.methods.generatedSlug = function(): string{
    return getSlug();
}

export default model<IPedido>('Pedido', pedidoSchema);