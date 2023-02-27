import { model, Schema } from "mongoose";
import { getSlug } from "../helpers/create-strings";
import { IDistrito } from "../interfaces/distrito.interface";


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
    return getSlug();
}

export default model<IDistrito>('Distrito', distritoSchema);