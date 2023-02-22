import { model, Schema } from "mongoose";
import { IDistrito } from "src/interfaces/distrito.interface";


const distritoSchema: Schema =  new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    slug: { type: String },
    active: { type: Boolean, default: false },
    locals: [ { type: Schema.Types.ObjectId, ref: 'Local' } ]
},{
    timestamps: true
})

distritoSchema.pre<IDistrito>('save', async function(next){
    if(!this.slug){
        this.slug = this.generatedSlug();
    }
    next();
});

distritoSchema.methods.generatedSlug = function(): string{
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 10; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return slug;
}

export default model<IDistrito>('Distrito', distritoSchema);