import { Document } from "mongoose";

export interface IDocumentType extends Document{
    _id: string;
    type: string;
    slug: string;
    generatedSlug: () => string;
}