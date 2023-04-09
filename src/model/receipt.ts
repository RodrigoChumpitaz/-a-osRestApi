import { Schema, model} from 'mongoose';
import { getSlug } from '../helpers/create-strings';
import { IReceipt } from 'src/interfaces/receipt.interface';

const receiptSchema: Schema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    payment: { 
        id: { type: String},
        slug: { type: String}
    },
    igv: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    receiptNumber: { type: Number, required: true },
    slug: { type: String },
},{
    timestamps: true,
})

receiptSchema.pre<IReceipt>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
})

receiptSchema.methods.generatedSlug = function(){
    return getSlug();
}

export default model('Receipt', receiptSchema);