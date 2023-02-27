import { Request, Response } from "express";
import { err, ok } from "neverthrow";
import { IDistrito } from "src/interfaces/distrito.interface";
import { ILocal } from "src/interfaces/local.interface";
import Distrito from "../../model/distritos";
import Local from "../../model/local";

export const getLocals = async (req: Request, res: Response) => {
    try {
        const locals = await Local.find({ active: true });
        return ok(res.status(200).json(locals));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const addLocal = async (req: Request, res: Response) => {
    try {
        const { telefono, direccion, distrito } = req.body;
        const distritoByName: IDistrito = await Distrito.findOne({ nombre: distrito }).select('-__v -createdAt -updatedAt');
        if(!distritoByName) return err(res.status(404).json({ message: 'Distric not found' }));
        const newLocal: ILocal =  new Local({ telefono, direccion, distrito: { id: distritoByName.id, slug: distritoByName.slug, name: distritoByName.nombre} });
        await newLocal.save();
        await Distrito.findByIdAndUpdate(distritoByName._id, { $push: { locals: newLocal } })
        await distritoByName.save();
        return ok(res.status(200).json({ 
            message: 'Local added',
            local: newLocal,
            distrito: {
                msg: 'Local added to distrito',
                distrito: distritoByName
            }
        }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
};

export const getLocalByData = async (req: Request, res: Response) => {
    try {
        const { data } = req.params;
        const local: ILocal =  await Local.findOne({ 
            $or: [
                { slug: data }, 
                { telefono: data },
                { direccion: data },
            ] 
        }).select('-__v -createdAt -updatedAt');
        if(!local) return err(res.status(404).json({ message: 'Local not found' }));
        return ok(res.status(200).json(local));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
};

export const updateLocal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const { telefono, direccion, distrito } = req.body;
        const local: ILocal = await Local.findById(id).select('-__v -createdAt -updatedAt');
        const distritoActual: IDistrito = await Distrito.findById(local.distrito.id).select('-__v -createdAt -updatedAt');
        const distric: IDistrito = await Distrito.findOne({ nombre: distrito }).select('-__v -createdAt -updatedAt');
        if(distritoActual.nombre != distric.nombre){
            await Distrito.findByIdAndUpdate(distritoActual._id, { $pull: { locals: local.id } });
            await Distrito.findByIdAndUpdate(distric._id, { $push: { locals: local } });
        }
        local.telefono = telefono;
        local.direccion = direccion;
        local.distrito = { id: distric.id, slug: distric.slug, name: distric.nombre };
        await local.save();
        return ok(res.status(200).json({
            message: 'Local updated',
            local: local,
        }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
};


