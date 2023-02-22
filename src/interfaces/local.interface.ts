import { Document } from "mongoose";
import { IDistrito } from "./distrito.interface";

export interface ILocal extends Document{
    _id: string;
    telefono?: string;
    direccion?: string;
    distrito?: {
        id: string;
        slug: string;
        name: string;
    };
    slug: string;
    active: boolean;
    generatedSlug: () => string;
}