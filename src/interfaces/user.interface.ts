import { Document } from 'mongoose'
import { IDocumentType } from './documentType.interface';
import { IRol } from './rol.interface';
import { ICarta } from './carta.interface';
export interface IUser extends Document{
    name: string;
    lastname: string;
    documentType: IDocumentType;
    documentNumber: string;
    email: string;
    password: string;
    address: string;
    token: string;
    slug: string;
    status: string;
    confirmed: boolean;
    carrito: ICarta[];
    roles: IRol[];
    comparePassword: (password: string) => Promise<boolean>;
    generatedSlug: () => string;
}