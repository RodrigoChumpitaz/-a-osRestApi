import { model, Schema } from "mongoose";
import { IDistrito } from "src/interfaces/distrito.interface";

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
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 10; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return slug;
}

export default model<IDistrito>('Local', localSchema)