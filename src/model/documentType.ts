import { Schema, model } from "mongoose";
import { getSlug } from "../helpers/create-strings";
import { IDocumentType } from "../interfaces/documentType.interface";

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
    return getSlug();
}

export default model<IDocumentType>('DocumentType', documentTypeSchema);