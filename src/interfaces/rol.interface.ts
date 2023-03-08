import { IPermission } from "./permission.interface";

export interface IRol {
    _id: string;
    rol: string;
    permissions: IPermission[];
    isActive: boolean;
}