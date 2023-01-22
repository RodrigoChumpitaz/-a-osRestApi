import { IPermission } from "./permission.interface";

export interface IRol {
    rol: string;
    permissions: IPermission[];
}