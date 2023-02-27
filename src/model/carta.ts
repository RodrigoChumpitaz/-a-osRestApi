import { model, Schema } from "mongoose";
import { ICarta } from "../interfaces/carta.interface";
import { getSlug } from "../helpers/create-strings";

const cartaSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/defaultfoodImage.png' },
    category: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true}
    },
    slug: { type: String },
    available: { type: Boolean, default: true }
},{
    timestamps: true,
    versionKey: false
})

cartaSchema.pre<ICarta>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
})

cartaSchema.methods.generatedSlug = function(){
    return getSlug()
};

export default model('Carta', cartaSchema);