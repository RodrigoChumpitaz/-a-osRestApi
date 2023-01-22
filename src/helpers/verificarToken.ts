import { Request } from "express";
import jwt from "jsonwebtoken";
import { environment } from "../config/env";
import User from "../model/user";

export const verificarToken =  async (req: Request): Promise<boolean> => {
    let isEjecutor: boolean = false;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, environment.jwtSecret);
    let user = await User.findOne({ decoded }).select('-password -lastname').populate('roles');
    user.roles.forEach((rol) => {
        if (rol.rol === 'visor' || rol.rol === 'admin') {
            isEjecutor = true;
        }
    })
    return isEjecutor;
}

export const isAdmin = async (req: Request): Promise<boolean> => {
    let isAdmin: boolean = false;
    const token = req.headers.authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, environment.jwtSecret);
    let user = await User.findOne({ email: decoded.email }).select('-password -lastname').populate('roles');
    user.roles.forEach((rol) => {
        if (rol.rol === 'admin') {
            isAdmin = true;
        }
    })
    return isAdmin;
}
