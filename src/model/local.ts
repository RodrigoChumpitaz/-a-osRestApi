import { model, Schema } from "mongoose";
import { getSlug } from "../helpers/create-strings";
import { IDistrito } from "../interfaces/distrito.interface";

const localSchema: Schema = new Schema({
    telefono: { type: String ,require: true, length: 9, unique: true },
    direccion: { type: String, require: true, default: 'Sin dirección' },
    distrito: { 
        id: String,
        slug: String,
        name: String 
    },
    slug: { type: String, unique: true },
    active: { type: Boolean, default: true }
},{
    timestamps: true
})


localSchema.pre<IDistrito>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
});

localSchema.methods.generatedSlug = function(): string{
    return getSlug();
}

export default model<IDistrito>('Local', localSchema)