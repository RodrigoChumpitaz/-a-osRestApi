import { Schema, model } from 'mongoose';
import { getSlug } from '../helpers/create-strings';
import { ISales } from 'src/interfaces/sales.interface';

const salesSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Pedido' },
    paymentId: { type: String },
    amount: { type: Number },
    aditional: { type: Number },
    paymentMethod: { type: String, default: 'cash' },
    currency: { type: String },
    status: { type: String, default: 'paid' },
    slug: { type: String }
},{
    timestamps: true
})

salesSchema.pre<ISales>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
})

salesSchema.methods.generatedSlug = function(): string{
    return getSlug();
}

export default model('Sales', salesSchema);
