import { Request, Response } from "express";
import { err, ok } from "neverthrow";
import Verificar from "../../helpers/verificarToken";
import { IRol } from "../../interfaces/rol.interface";
import Rol from "../../model/rol";

const verificar = new Verificar();
export const rolesList = async (req: Request, res: Response) => {
    try {
        const isEjecutor = await verificar.verificarToken(req);
        if (!isEjecutor) return res.status(401).json({ msg: 'Unauthorized' });
        const roles: IRol[] = await Rol.find().populate('permissions');
        return ok(res.status(200).json(roles));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const addRols = async (req: Request, res: Response) => {
    try {
        const isAdmin = await verificar.isAdmin(req);
        if (!isAdmin) return res.status(401).json({ msg: 'The user dont have authorization' });
        const { rol, permissions } = req.body;
        const rolExists: IRol = await Rol.findOne({ rol });
        if(rolExists) return res.status(400).json({ msg: 'The rol already exists' });
        const newRol = new Rol({ rol, permissions });
        await newRol.save();
        return ok(res.status(201).json({
            msg: 'Rol created successfully',
            newRol: newRol
        }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}
