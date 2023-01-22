import { Document } from 'mongoose'
import { IRol } from './rol.interface';
export interface IUser extends Document{
    name: string;
    lastname: string;
    email: string;
    password: string;
    roles: IRol[];
    comparePassword: (password: string) => Promise<boolean>;
}