import { Request, Response } from "express";
import Carta from "../../../model/carta";
import { ICarta } from "src/interfaces/carta.interface";
import { Document } from "mongoose";
import { IPedido } from "src/interfaces/pedido.interface";
import Pedido from "../../../model/pedido";
import { err, ok } from "neverthrow";
import DetallePedido from "../../../model/detallePedido";
import { IDetallePedido } from "src/interfaces/detalle_pedido";
import Verificar from "../../../helpers/verificarToken";

const verificar = new Verificar()

export const createOrderDetail = async (req: Request, res: Response) => {
    try {
        const { user_token } = req.headers;
        const { deliveryDate, observation, data } = req.body;
        const user: any = await verificar.decodeToken(user_token); 
        let cartByName: Partial<ICarta | Document | any>;
        let newOrder = new Pedido({ deliveryDate, client: { id: user._id, name: user.name, email: user.email, slug: user.slug }, observation });
        await newOrder.save();
        data.forEach(async (data: any) => {
            let centinel = false;
            cartByName = await Carta.findOne({ name: data.Cart });
            let newOrderDetail = new DetallePedido({ order: newOrder._id, Cart: cartByName._id, quantity: data.quantity });
            await Pedido.findByIdAndUpdate(newOrder._id, { $push: { orderDetail: newOrderDetail._id } });
            if (centinel === false) {
                await newOrderDetail.save();
            }
            centinel = true;
        })
        return ok(res.status(200).json({ message: 'Detalle de pedido creado' }))
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const getOrderDetailByOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params ;
        const ordersDetails: Partial<IDetallePedido[] | Document[]> = await DetallePedido.find({ order: orderId }).select('-__v -createdAt -updatedAt').populate('Cart', 'category.name name price description imgUrl _id').populate('order', '-__v -orderDetail -slug -imgPrueba -client.slug -client.name -client.name -createdAt -updatedAt');
        if (!ordersDetails || ordersDetails.length === 0) {
            return err(res.status(404).json({ message: 'No se encontraron detalles de pedidos' }));
        }
        return ok(res.status(200).json(ordersDetails));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


