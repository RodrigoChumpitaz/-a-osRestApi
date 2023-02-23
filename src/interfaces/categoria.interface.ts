import { Document } from "mongoose";

export interface ICategoria extends Document{
    description: string;
    slug: string;
    state: boolean;
    generatedSlug: () => string;
}