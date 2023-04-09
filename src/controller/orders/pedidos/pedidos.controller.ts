import User from '../../../model/user';
import Pedido from '../../../model/pedido';
import { Request, Response } from 'express';
import { err, ok } from 'neverthrow';
import Verificar from '../../../helpers/verificarToken';
import { Document } from 'mongoose';
import { IPedido } from '../../../interfaces/pedido.interface';
import { FileResponse } from '../../../interfaces/file-response.interface';
import DetallePedido from '../../../model/detallePedido';
import Carta from '../../../model/carta';
import { IUser } from 'src/interfaces/user.interface';
import { ICarta } from 'src/interfaces/carta.interface';
import { ChargeResponse } from 'src/interfaces/charge.interface';
import Sales from '../../../model/sales';
import { ISales } from 'src/interfaces/sales.interface';
import Receipt from '../../../model/receipt';

const verificar = new Verificar()

export const createOrder = async (req: Request, res: Response) => {
    try {
        // const { user_token } = req.headers;
        // const user: any = await verificar.decodeToken(user_token); 
        // const { observation } = req.body;
        // const newPedido = new Pedido({ client: { id: user._id, name: user.name, email: user.email, slug: user.slug }, observation });
        // await newPedido.save();
        return ok(res.status(200).json({ message: 'Deprecated Endpoint', /* pedido: newPedido */ }));
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
        const {  } = req.body;
        const orderById = await Pedido.findById(id).populate({ path: 'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } }).select('-__v -createdAt -updatedAt -client.id -client.slug -slug');
        if(!orderById || orderById === null) return err(res.status(404).json({ message: 'No se encontró el pedido' }));
        orderById.orderDetail.forEach(async (detail: Partial<IPedido>) => {
            let orderTail = await DetallePedido.findById(detail);
            console.log(orderTail)
        })
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

/* FLUJO DE CARRITO E INICIO DEL PEDIDO */

export const getCarritoByUser = async (req: Request, res: Response) => {
    try {
        const { user_token } = req.headers;
        const user: Partial<IUser | Document | any> = await verificar.decodeToken(user_token);
        if(user.carrito.length === 0) return err(res.status(404).json({ message: 'No hay platos en el carrito :(' }));
        const carrito: Partial<ICarta[] | Document[]> = await Carta.find({ _id: { $in: user.carrito } }).select('-__v -createdAt -updatedAt');
        return ok(res.status(200).json(carrito));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const addCarritoToUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { user_token } = req.headers;
        const cartToId = await Carta.findById(id).select('-__v -createdAt -updatedAt');
        if(!cartToId || cartToId === null) return err(res.status(404).json({ message: 'No se encontró el producto' }));
        const user: Partial<IUser | Document | any> = await verificar.decodeToken(user_token);
        if(user.carrito.includes(cartToId._id)) {
            return err(res.status(400).json({ message: 'El producto ya se encuentra en el carrito' }));
        }
        await User.findByIdAndUpdate(user._id, { $push: { carrito: cartToId._id } });
        return ok(res.status(200).json({ message: 'Producto agregado al carrito' }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const deleteCartTorCarrito = async (req: Request, res: Response) => {
    try {
        const { id } =  req.params;
        const { user_token } = req.headers;
        const cartToId = await Carta.findById(id).select('-__v -createdAt -updatedAt');
        if(!cartToId || cartToId === null) return err(res.status(404).json({ message: 'No se encontró el producto' }));
        const user: Partial<IUser | Document | any> = await verificar.decodeToken(user_token);
        if(!user.carrito.includes(cartToId._id)){
            return err(res.status(400).json({ message: 'El producto no se encuentra en el carrito' }));
        }
        await User.findByIdAndUpdate(user._id, { $pull: { carrito: cartToId._id } });
        return ok(res.status(200).json({ message: 'Producto eliminado del carrito' }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


/* Flujo de pagos y creacion de ventas */
export const paidOrder = async (req: Request, res: Response) => {
    try {
        const { charge, orderId } = req.body;
        const _order = await Pedido.findById(orderId);
        if(!_order || _order === null) return err(res.status(404).json({ message: 'No hay un pedido pendiente' }));
        const data: ChargeResponse = charge; 
        if(!data.id){
            return err(res.status(400).json({ message: 'No se pudo procesar el pago' }));
        }
        const orderAmount = data.amount.toString().substring(0, data.amount.toString().length - 2) + ".00";
        const newSale = new Sales({ orderId: orderId, amount: orderAmount, currency: data.currency_code, paymentId: data.id })
        await Pedido.findByIdAndUpdate(orderId, { status: 'Pagado' });
        await User.findByIdAndUpdate(_order.client.id, { carrito: [] });
        await newSale.save();
        return ok(res.status(200).json({ message: 'Pago procesado correctamente' }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const finalizedOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const _sale: ISales = await Sales.findOne({ orderId })
        const _order: IPedido = await Pedido.findById(orderId);
        if(_order.status === 'Por entregar') return err(res.status(400).json({ message: 'El pedido ya fue finalizado' }));
        const allReceipts = await Receipt.find();
        const newReceipt = new Receipt({ orderId, payment: { id: _sale._id, slug: _sale.slug }, igv: 1.18, subtotal: _sale.amount, total: _sale.amount * 1.18, receiptNumber: allReceipts.length + 1})
        await Pedido.findByIdAndUpdate(orderId, { status: 'Por entregar' });
        await newReceipt.save();
        return ok(res.status(200).json({ message: 'Pedido finalizado correctamente' }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}