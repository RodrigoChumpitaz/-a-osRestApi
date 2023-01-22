import passport, { PassportStatic } from "passport";
import { NextFunction, Request, Response } from "express";  

export default function validate(req: Request ,res: Response,next: NextFunction): PassportStatic | Response{
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        try {
            passport.authenticate('jwt', { session: false });  
        } catch (error) {
            return res.status(401).json({message: 'Unauthorized'})
        }
    }
    next();
}