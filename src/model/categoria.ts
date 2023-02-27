import { model, Schema } from "mongoose";
import { getSlug } from "../helpers/create-strings";
import { ICategoria } from "../interfaces/categoria.interface";

const categoriaSchema: Schema = new Schema({
    description: { type: String, required: true, unique: true },
    slug: { type: String },
    imgUrl: { type: String, default: 'https://rod-storage-test.s3.ap-northeast-1.amazonaws.com/defaultfoodImage.png' },
    state: { type: Boolean, required: true, default: true }
},{
    timestamps: true,
})

categoriaSchema.pre<ICategoria>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
})

categoriaSchema.methods.generatedSlug = function(): string{
    return getSlug();
}


export default model<ICategoria>('Categoria', categoriaSchema);