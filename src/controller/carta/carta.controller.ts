import { Request, Response } from "express";
import Categoria from "../../model/categoria";
import { FileResponse } from "../../interfaces/file-response.interface";
import Carta from "../../model/carta";
import { ICarta } from "../../interfaces/carta.interface";
import { Document } from "mongoose";
import { ICategoria } from "../../interfaces/categoria.interface";
import { getDataByCategory } from "./dataCategory";
import { err, ok } from "neverthrow";

export const getCarts = async (req: Request, res: Response) => {
    try {
        const carts: ICarta[] = await Carta.find();
        if(carts.length === 0) return res.status(404).json({ message: 'No records' });
        return res.status(200).json(carts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addCart = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category } = req.body;
        if(!name || !price || !description || !category) return res.status(400).json({ message: 'All fields are required' });

        const categoryByName: ICategoria = await Categoria.findOne({ description: category });
        if(!categoryByName) return res.status(404).json({ message: 'Category not found' });

        const _dataCategory = getDataByCategory(categoryByName);

        if(req.file){
            const file: Partial<FileResponse> = req.file;
            const newCart = new Carta({ name, price, description, imgUrl: file.location, category: _dataCategory });
            await newCart.save();
            return res.status(200).json({ message: 'Cart added succesfully', cart: newCart });
        }

        const newCart = new Carta({ name, price, description, category: _dataCategory });
        await newCart.save();
        return res.status(200).json({ message: 'Cart added succesfully', cart: newCart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const searchCart = async (req: Request, res: Response) => {
    try {
        const { data } = req.params;
        const cart: Partial<ICarta | Document> = await Carta.findOne({ $or: [
            { name:  data },
            { description: data },
            { slug: data },
        ] }).select("-category.slug -category.id -createdAt -updatedAt");
        if(!cart || cart === null) return res.status(404).json({ message: 'Cart not found' });
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const cartDataByIds = async (req: Request, res: Response) => {
    try {
        const { dataMap } = req.body;
        const carts: Partial<ICarta[] | Document[]> = await Carta.find({ 
            _id: { $in: dataMap } 
        }).select("-category.slug -category.id -createdAt -updatedAt");
        return res.json(carts);
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const getCartasByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const carts: Partial<ICarta[] | Document[]> = await Carta.find({ 
            'category.name': category, available: true 
        }).select("-_id -category.slug -category.id -createdAt -updatedAt");
        if(!carts || carts.length === 0) return res.status(404).json({ message: "The Category does'nt exist or is incorrect" });
        return ok(res.status(200).json(carts));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
} 


export const changeAvailable = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cartById: ICarta = await Carta.findById(id);
        if(!cartById) return res.status(404).json({ message: 'Cart not found' });   
        if(cartById.available === true){
            await Carta.findByIdAndUpdate(id, { available: false });
            return res.status(200).json({ message: 'Cart disabled succesfully' });
        }
        await Carta.findByIdAndUpdate(id, { available: true });
        return res.status(200).json({ message: 'Cart enabled succesfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateCart = async (req: Request, res: Response) => {
    try {
        const { name, price, description, category, id } = req.body;
        const cartaById: ICarta = await Carta.findOne({ _id: id });
        if(!cartaById || cartaById === null) return res.status(404).json({ message: 'Cart not found' });
        
        const categoryByName: ICategoria = await Categoria.findOne({ description: category });
        if(!categoryByName || cartaById === null) return res.status(404).json({ message: 'Category not found' });
        const _dataCategory = getDataByCategory(categoryByName);

        if(req.file){
            const file: Partial<FileResponse> = req.file;
            cartaById.imgUrl = file.location;
        }
        cartaById.name = name || cartaById.name;
        cartaById.price = price || cartaById.price;
        cartaById.description = description || cartaById.description;
        cartaById.category = _dataCategory || cartaById.category;
        await cartaById.save();
        return res.status(200).json({ message: 'Cart updated succesfully', cart: cartaById });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}