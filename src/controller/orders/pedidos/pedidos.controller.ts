import User from '../../../model/user';
import Pedido from '../../../model/pedido';
import { Request, Response } from 'express';
import { err, ok } from 'neverthrow';
import Verificar from '../../../helpers/verificarToken';
import { Document } from 'mongoose';
import { IPedido } from 'src/interfaces/pedido.interface';

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
        orderToConfirm.status = 'Entregado';
        await orderToConfirm.save();
        return ok(res.status(200).json({ message: 'Pedido confirmado' }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const updateOrder = async (req: Request, res: Response) => {
    
}