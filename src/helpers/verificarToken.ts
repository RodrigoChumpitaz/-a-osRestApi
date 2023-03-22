import { Request } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import { environment } from "../config/env";
import User from "../model/user";
import { Document } from "mongoose";

export default class Verificar{
    public async verificarToken(req: Request): Promise<boolean> {
        let isEjecutor: boolean = false;
        const token = req.headers.authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, environment.jwtSecret);
        let user = await User.findOne({ email: decoded.email }).select('-password -lastname').populate('roles');
        user.roles.forEach((rol) => {
            if (rol.rol === 'moderator' || rol.rol === 'admin') {
                isEjecutor = true;
            }
        })
        return isEjecutor;
    }

    public async isAdmin(req: Request): Promise<boolean> {
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

    public async decodeToken(token: any): Promise<IUser | Document>{
        // const token: any = req.headers.user_token;
        const decoded: any = jwt.verify(token, environment.jwtSecret);
        const user: IUser = await User.findById( decoded.id ).select('-password -lastname -documentType -documentNumber -password -address -token -confirmed -roles -createdAt -updatedAt');
        return user;
    }
}
