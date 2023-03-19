import { Schema, model } from 'mongoose'
import { IDetallePedido } from 'src/interfaces/detalle_pedido';

const detallePedidoSchema = new Schema({
    detail: { type: String },
    Cart: { type: Schema.Types.ObjectId, ref: 'Carta' },
    observation: { type: String },
    step: { type: Number, default: 1 },
    order: { type: Schema.Types.ObjectId, ref: 'Pedido' },
    quantity: { type: Number, default: 1 },
    slug: { type: String }
},{
    timestamps: true,
    versionKey: false
})

detallePedidoSchema.pre<IDetallePedido>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
})

export default model('DetallePedido', detallePedidoSchema)

