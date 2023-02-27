import { Document } from "mongoose";

export interface ICategoria extends Document{
    _id: string;
    description: string;
    slug: string;
    imgUrl: string;
    state: boolean;
    generatedSlug: () => string;
}