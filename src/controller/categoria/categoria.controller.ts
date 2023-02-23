import { Request, Response } from "express";
import { err, ok } from "neverthrow";
import { ICategoria } from "src/interfaces/categoria.interface";
import Categoria from "../../model/categoria";


export const getCategorias = async (req: Request, res: Response) => {
    try {
        const categories = await Categoria.find({ state: true });
        return ok(res.status(200).json(categories));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const addCategoria = async (req: Request, res: Response) => {
    try {
        const { description } = req.body;
        if(!description) return err(res.status(400).json({ message: 'Description is required' }));
        const newCategoria = new Categoria({ description });
        await newCategoria.save();
        return ok(res.status(200).json({ message: 'Category added', categoria: newCategoria }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const searchCategory = async (req: Request, res: Response) => {
    try {
        const { description } = req.params;
        const categoryByDecription: ICategoria[] = await Categoria.find({ description: { $regex: description, $options: 'i' } });
        if(categoryByDecription.length === 0) return err(res.status(404).json({ message: 'Category not found', status: 404 }));
        return ok(res.status(200).json(categoryByDecription));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const categoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryById: ICategoria = await Categoria.findById(id);
        if(!categoryById) return err(res.status(404).json({ message: 'Category not found', status: 404 }));
        return ok(res.status(200).json(categoryById));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const changeStateToCategory = async (req: Request, res: Response) => {
    try {
        const { id, data } = req.params;
        const categoryByData: ICategoria = await Categoria.findById(id);
        if(!categoryByData) return err(res.status(404).json({ message: 'Category not found', status: 404 }));
        if(data === "0"){
            await Categoria.findByIdAndUpdate(id, { state: true });
            return ok(res.status(200).json({ message: 'Category activated', status: 200 }));
        }
        await Categoria.findByIdAndUpdate(id, { state: false });
        return ok(res.status(200).json({ message: 'Category inactivated', status: 200 }));
    } catch (error) { 
        return err(res.status(500).json({ message: error.message }));
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { data } = req.body;
        const categoryBySlug: ICategoria = await Categoria.findOne({ slug });
        if(!categoryBySlug) return err(res.status(404).json({ message: 'Category not found', status: 404 }));
        categoryBySlug.description = data.description;
        await categoryBySlug.save();
        return ok(res.status(200).json({ message: 'Category updated', status: 200 }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}