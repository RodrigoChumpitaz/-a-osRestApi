import { IUser } from "../interfaces/user.interface";
import jwt from 'jsonwebtoken';
import { environment } from '../config/env';

export function createToken(user: IUser){
    return jwt.sign({ id: user._id, email: user.email, roles: user.roles }, environment.jwtSecret, { expiresIn: 86400 })
}