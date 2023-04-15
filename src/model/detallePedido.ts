import { Schema, model } from 'mongoose'
import { getSlug } from '../helpers/create-strings';
import { IDetallePedido } from 'src/interfaces/detalle_pedido';

const detallePedidoSchema = new Schema({
    Cart: { type: Schema.Types.ObjectId, ref: 'Carta' },
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

detallePedidoSchema.methods.generatedSlug = function(): string{
    return getSlug();
}

export default model('DetallePedido', detallePedidoSchema)

