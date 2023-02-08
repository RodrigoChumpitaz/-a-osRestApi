import { Document } from 'mongoose'
import { IDocumentType } from './documentType.interface';
import { IRol } from './rol.interface';
export interface IUser extends Document{
    name: string;
    lastname: string;
    documentType: IDocumentType;
    documentNumber: string;
    email: string;
    password: string;
    address: string;
    token: string;
    confirmed: boolean;
    roles: IRol[];
    comparePassword: (password: string) => Promise<boolean>;
}