import { Schema, model } from "mongoose";
import { IDocumentType } from "src/interfaces/documentType.interface";

const documentTypeSchema: Schema = new Schema({
    type: { type: String, required: true, trim: true },
    slug: { type: String, required: false, lowercase: true, trim: true }
},{
    timestamps: true,
    versionKey: false
});

documentTypeSchema.pre<IDocumentType>('save', async function(next){
    this.slug = this.generatedSlug();
    next();
});

documentTypeSchema.methods.generatedSlug = function(): string{
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 10; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return slug;
}

export default model<IDocumentType>('DocumentType', documentTypeSchema);