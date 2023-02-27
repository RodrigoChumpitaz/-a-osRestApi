import { Document } from "mongoose";

export interface ICarta extends Document{
    name: string;
    price: number;
    description: string;
    imgUrl: string;
    category: {
        id: string;
        name: string;
        slug: string;
    }
    slug: string;
    available: boolean;
    generatedSlug: () => string;
}