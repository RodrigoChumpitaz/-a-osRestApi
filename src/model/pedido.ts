import { Schema, model } from "mongoose";
import { IPedido } from "../interfaces/pedido.interface";
import { getSlug } from "../helpers/create-strings";

const pedidoSchema = new Schema({
    deliveryDate: { type: Date, required: true },
    slug: { type: String },
    imgPrueba: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/defaultfoodImage.png' },
    observation: { type: String },
    status: { type: String, required: true, default: 'Pendiente' },
    client: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true}
    },
    orderDetail: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }],
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