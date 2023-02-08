import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";  
import { environment } from "../config/env";
import User from "../model/user";
import { IUser } from "../interfaces/user.interface";

export type UserDecoded = Partial<IUser>;

export default async function validate(req: Request, res: Response,next: NextFunction){
    let token;
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: UserDecoded | any = jwt.verify(token, environment.jwtSecret);
            req.user = await User.findById(decoded.id).select('-password -lastname -token -confirmado').populate('roles');
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
    }

    if(!token) return res.status(403).json({ message: 'Invalid token' });
    next();
}