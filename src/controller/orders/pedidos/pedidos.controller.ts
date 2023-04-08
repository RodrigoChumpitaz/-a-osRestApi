import User from '../../../model/user';
import Pedido from '../../../model/pedido';
import { Request, Response } from 'express';
import { err, ok } from 'neverthrow';
import Verificar from '../../../helpers/verificarToken';
import { Document } from 'mongoose';
import { IPedido } from '../../../interfaces/pedido.interface';
import { FileResponse } from '../../../interfaces/file-response.interface';

const verificar = new Verificar()

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { user_token } = req.headers;
        const user: any = await verificar.decodeToken(user_token); 
        const { observation } = req.body;
        const newPedido = new Pedido({ client: { id: user._id, name: user.name, email: user.email, slug: user.slug }, observation });
        await newPedido.save();
        return ok(res.status(200).json({ message: 'Pedido creado', pedido: newPedido }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const getOrders  = async (req: Request, res: Response) => {
    try {
        const pedidos: Partial<IPedido[] | Document[]> = await Pedido.find().select('-__v -createdAt -updatedAt')
            .populate({ path:'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } })
        pedidos.forEach((pedido: any) => {
            console.log(pedido.status)
        });
        return ok(res.status(200).json(pedidos));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ordersByUser = await Pedido.find({ 'client.id': id });
        return ok(res.status(200).json(ordersByUser));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }

}

export const confirmOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const orderToConfirm = await Pedido.findById(id); 
        let estadoActual = orderToConfirm.status;
        if (estadoActual === 'Entregado') {
            return err(res.status(400).json({ message: 'El pedido ya fue entregado' }));
        }
        if(estadoActual === 'Invalidado') {
            return err(res.status(400).json({ message: 'El pedido fue invalidado' }));
        }
        if(req.file){
            const file: Partial<FileResponse> = req.file;
            orderToConfirm.imgPrueba = file.location;
        }else{
            return err(res.status(400).json({ message: 'La imagen de prueba es obligatoria' }));
        }
        orderToConfirm.status = 'Entregado';
        await orderToConfirm.save();
        return ok(res.status(200).json({ message: 'Pedido confirmado' }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { id } =  req.params;
        const orderById = await Pedido.findById(id);
        if(!orderById || orderById === null) return err(res.status(404).json({ message: 'No se encontró el pedido' }));
        return ok(res.status(200).json(orderById));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const getOrdersByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;
        const objOrders: IPedido[] = await Pedido.find({ status }).select('-__v -createdAt -updatedAt');
        if(objOrders.length === 0) return err(res.status(404).json({ message: 'No se encontraron resultados' }));
        return ok(res.status(200).json(objOrders));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}
