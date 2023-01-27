import { Request, Response } from "express";
import Verificar from "../../helpers/verificarToken";
import { IPermission } from "../../interfaces/permission.interface";
import Permission from "../../model/Permission";

const verficar = new Verificar();

export const permissionList = async (req: Request, res: Response) => {
    const isEjecutor  = await verficar.verificarToken(req);
    if(!isEjecutor) return res.status(401).json({ msg: 'You are not authorized to access this resource' });
    const permissions: IPermission[] = await Permission.find();
    return res.status(200).json(permissions);
}

export const addpermission = async (req: Request, res: Response) => {
    const { name } = req.body;
    if(name.length < 4) return res.status(400).json({ msg: 'The name must be at least 4 characters long' });
    const permission: IPermission = await Permission.findOne({ name });
    if(permission) return res.status(400).json({ msg: 'The permission already exists' });
    const is_admin: boolean = await verficar.isAdmin(req);
    if(!is_admin) return res.status(401).json({ msg: 'You are not authorized to access this resource because you are not an administrator'});
    const newPermission = new Permission({ name });
    await newPermission.save();
    return res.status(201).json(newPermission);
}