import { IUser } from "../interfaces/user.interface";
import jwt from 'jsonwebtoken';
import { environment } from '../config/env';

export function createAuthToken(user: IUser){
    return jwt.sign({ id: user._id, email: user.email, roles: user.roles }, environment.jwtSecret, { expiresIn: '30d' })
}

export function createRefreshToken(user: IUser){
    return jwt.sign({ id: user._id }, environment.jwtSecret, { expiresIn: 7 * 24 * 60 * 60 * 1000 })
}