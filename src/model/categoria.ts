import { model, Schema } from "mongoose";
import { ICategoria } from "../interfaces/categoria.interface";

const categoriaSchema: Schema = new Schema({
    description: { type: String, required: true, unique: true },
    slug: { type: String },
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
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 10; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return slug;
}


export default model<ICategoria>('Categoria', categoriaSchema);