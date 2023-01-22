import { Request, Response } from "express";
import { IRol } from "../../interfaces/rol.interface";
import Rol from "../../model/rol";

export const rolesList = async (req: Request, res: Response) => {
    const roles: IRol[] = await Rol.find().populate('permissions');
    return res.status(200).json(roles);
}


export const addRols = async (req: Request, res: Response) => {
    const { rol, permissions } = req.body;
    const rolExists: IRol = await Rol.findOne({ rol });
    if(rolExists) return res.status(400).json({ msg: 'The rol already exists' });
    const newRol = new Rol({ rol, permissions });
    await newRol.save();
    return res.status(201).json({
        msg: 'Rol created successfully',
        newRol: newRol
    });
}
