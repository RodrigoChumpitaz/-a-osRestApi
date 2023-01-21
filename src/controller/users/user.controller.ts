import { Request, Response } from 'express';
import User from '../../model/user';
import { IUser } from '../../interfaces/user.interface';
import { createToken } from '../../helpers/createtoken';

export const signup = async (req: Request, res: Response): Promise<Response> => {
    const { name, lastname, email, password, roles } = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({
            msg: 'Please send your name, email and password'
        });
    }
    const user: IUser = await User.findOne({ email });
    if(user) {
        return res.status(400).json({
            msg: 'The user already exists'
        });
    }
    const newUser = new User({ name, lastname, email, password, roles });
    await newUser.save();
    return res.status(201).json(newUser);
};


export const signin = async (req: Request, res: Response) => {  
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({
            msg: 'Please send your email and password'
        });
    }

    const user: IUser = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({
            msg: 'The user does not exist'
        });
    }

    const isMatch = await user.comparePassword(password)
    if(isMatch) {
        return res.status(200).json({
            token: createToken(user)
        })
    }
    return res.status(400).json({
        msg: 'The email or password are incorrect'
    })
};