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
import { IDetallePedido } from 'src/interfaces/detalle_pedido';
import { getReceiptsLenght } from '../../../helpers/get-all-receipts';

const verificar = new Verificar()

export const getOrders  = async (req: Request, res: Response) => {
    try {
        const pedidos: Partial<IPedido[] | Document[]> = await Pedido.find().select('-__v -createdAt -updatedAt')
            .populate({ path:'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } })
        return ok(res.status(200).json(pedidos));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const getOrderToDeliver = async (req: Request, res: Response) => {
    try {
        const pedidosPorEntregar = await Pedido.find({ status: 'Por entregar', saleType: 'delivery' })
            .populate({ path: 'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } })
            .select('-__v -createdAt -updatedAt')
        const mapp = pedidosPorEntregar.map((pedido) => {
            return {
                id: pedido._id,
                cliente: pedido.client.name,
                fecha_entrega: pedido.deliveryDate,
                estado: pedido.status,
                tipo_venta: pedido.saleType,
                observación: pedido.observation
            }
        })
        return ok(res.status(200).json(mapp));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const getOrderEntregado = async (req: Request, res: Response) => {
    try {
        const pedidosPorEntregar = await Pedido.find({ status: 'Entregado', saleType: 'delivery' })
            .populate({ path: 'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } })
            .select('-__v -createdAt -updatedAt')
        const mapp = pedidosPorEntregar.map((pedido) => {
            return {
                id: pedido._id,
                cliente: pedido.client.name,
                fecha_entrega: pedido.deliveryDate,
                estado: pedido.status,
                tipo_venta: pedido.saleType,
                observación: pedido.observation
            }
        })
        return ok(res.status(200).json(mapp));
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
        if(estadoActual === 'Pendiente') {
            return err(res.status(400).json({ message: 'El pedido está pendiente' }));
        }
        if (estadoActual === 'Entregado') {
            return err(res.status(400).json({ message: 'El pedido ya fue entregado' }));
        }
        if(estadoActual === 'Invalidado') {
            return err(res.status(400).json({ message: 'El pedido fue invalidado' }));
        }
        if(req.file){
            const file: Partial<FileResponse> = req.file;
            orderToConfirm.imgPrueba = file.location;
        }/* else{
            return err(res.status(400).json({ message: 'La imagen de prueba es obligatoria' }));
        } */
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

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const orderToCancel = await Pedido.findById(id);
        if(!orderToCancel || orderToCancel === null) return err(res.status(404).json({ message: 'No se encontró el pedido' }));
        if(orderToCancel.status === 'Entregado') {
            return err(res.status(400).json({ message: 'El pedido no puede ser invalidado, ya que está entregado' }));
        } 
        if(orderToCancel.status === 'Invalidado') return err(res.status(400).json({ message: 'El pedido ya fue invalidado' }));
        if(orderToCancel.status === 'Por entregar' || orderToCancel.status === 'Pagado') return err(res.status(400).json({ message: 'El pedido ya fue cancelado' }));
        await Pedido.findByIdAndUpdate(orderToCancel._id, { status: 'Invalidado', observation: 'Pedido invalidado por el cliente' });
        return ok(res.status(200).json({ message: 'Pedido invalidado' }));
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


export const addAllCartsToCarrito = async (req: Request, res: Response) => {
    try {
        const { values } = req.body;
        const { user_token } = req.headers;
        const user: Partial<IUser | Document | any> = await verificar.decodeToken(user_token);
        if(!user || user === null) return err(res.status(404).json({ message: 'No se encontró el usuario' }));
        await User.findByIdAndUpdate(user._id, { carrito: values });
        return ok(res.status(200).json({ message: 'Carrito actualizado' })); 
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

/* Flujo de pagos y creacion de ventas */
export const paidOrder = async (req: Request, res: Response) => {
    try {
        const { charge, orderId } = req.body;
        const { user_token } = req.headers;
        if(!user_token || user_token === '' || user_token === null) return err(res.status(400).json({ message: 'No se encontró el token de usuario' }));
        const _order = await Pedido.findById(orderId);
        if(!_order || _order === null) return err(res.status(404).json({ message: 'No hay un pedido pendiente' }));
        if(_order.status === 'Pagado' || _order.status === 'Por entregar') return err(res.status(400).json({ message: 'El pedido ya fue pagado' }));
        const data: ChargeResponse = charge; 
        if(!data.id){
            return err(res.status(400).json({ message: 'No se pudo procesar el pago' }));
        }
        const orderAmount = ((data.amount / 100)).toFixed(2); 
        const newSale = new Sales({ orderId: orderId, amount: orderAmount, currency: data.currency_code, paymentId: data.id })
        if(_order.saleType === 'delivery') {
            newSale.aditional = 10;
        }
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
        const newReceipt = new Receipt({ orderId, payment: { id: _sale._id, slug: _sale.slug }, igv: 1.18, subtotal: _sale.amount, total: _sale.amount, receiptNumber: await getReceiptsLenght() + 1})
        await Pedido.findByIdAndUpdate(orderId, { status: 'Por entregar' });
        await newReceipt.save();
        return ok(res.status(200).json({ message: 'Pedido finalizado correctamente', receiptId: newReceipt._id }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const finalizedDeliveryOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { phoneNumber, reference } = req.body;
        const _order = await Pedido.findById(orderId);
        if(!_order || _order === null) return err(res.status(404).json({ message: 'No se encontró el pedido' }));
        let detail: Partial<IDetallePedido>;
        let cart: Partial<ICarta | Document | any>;
        let subtotal: number = 0;
        if(_order.status === 'Por entregar') return err(res.status(400).json({ message: 'El pedido ya fue finalizado' }));
        if(_order.status === 'Entregado') return err(res.status(400).json({ message: 'El pedido ya fue entregado' }));
        _order.observation = _order.observation + ` - ${phoneNumber}, ${reference}`;
        _order.status = 'Por entregar';
        for(let i in _order.orderDetail) {
            detail = await DetallePedido.findById(_order.orderDetail[i]);
            cart = await Carta.findById(detail.Cart);
            subtotal += cart.price * detail.quantity;
        }
        let orderSale = await Sales.findOne({ orderId })
        await User.findByIdAndUpdate(_order.client.id, { carrito: [] });
        const newReceipt = new Receipt({ orderId, payment: { id: orderSale._id, slug: orderSale.slug }, igv: 1.18, subtotal: orderSale.amount, total: (orderSale.amount + orderSale.aditional).toFixed(2), receiptNumber: await getReceiptsLenght() + 1})
        await newReceipt.save();
        await _order.save();
        return ok(res.status(200).json({ message: 'Pedido finalizado correctamente', receiptId: newReceipt._id }));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}