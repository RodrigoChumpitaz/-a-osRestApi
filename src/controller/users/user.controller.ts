import { Request, Response } from 'express';
import User from '../../model/user';
import { IUser } from '../../interfaces/user.interface';
import { createToken } from '../../helpers/createtoken';
import Verificar from '../../helpers/verificarToken';
import Rol from '../../model/rol';
import { IRol } from 'src/interfaces/rol.interface';

const verificar = new Verificar();

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
    const newUser: IUser = new User({ name, lastname, email, password });
    if(roles){
        const findRol: any[] = await Rol.find({rol: { $in: roles }}); // find roles in db
        newUser.roles = findRol.map(rol => rol._id); // get ids of roles
    }else{
        const rol: any = await Rol.findOne({ rol: 'user' });
        console.log(rol);
        newUser.roles = [rol._id];
    }
    await newUser.save();
    return res.status(201).json({
        msg: 'User created successfully',
        data: newUser
    });
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
        msg: 'The password is incorrect'
    })
};

export const userList = async (req: Request, res: Response) => {
    const isEjecutor = await verificar.verificarToken(req);
    if(!isEjecutor) return res.status(401).json({ msg: 'You are not authorized to access this resource' });
    const users: IUser[] = await User.find().populate('roles');
    return res.status(200).json(users);
    // const users: IUser[] = await User.find().populate('roles');
    // return res.status(200).json(users);
}