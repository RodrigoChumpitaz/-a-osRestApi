import { Document } from "mongoose";
import { ILocal } from "./local.interface";

export interface IDistrito extends Document{
    _id: string;
    nombre: string;
    slug: string;
    active: boolean;
    locals: ILocal[];
    generatedSlug: () => string;
}