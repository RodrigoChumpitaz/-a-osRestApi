import { Request, Response } from 'express';
import Receipt from '../../model/receipt';
import fs from 'fs';
import { err, ok } from 'neverthrow';
import Pedido from '../../model/pedido';
import DetallePedido from '../../model/detallePedido';
import Carta from '../../model/carta';
import Sales from '../../model/sales';
import { IDetallePedido } from 'src/interfaces/detalle_pedido';
import { ICarta } from 'src/interfaces/carta.interface';
import { IPedido } from 'src/interfaces/pedido.interface';
import { ISales } from 'src/interfaces/sales.interface';
import { IReceipt } from 'src/interfaces/receipt.interface';
import User from '../../model/user';
import { IUser } from 'src/interfaces/user.interface';



export const generatedReceipts = async (req: Request, res: Response) => {
    try {
        
        return ok(res.status(200).json({ message: 'ok' }));
    } catch (error) {
        // console.log(error);
        return err(res.status(500).json({ message: error.message }));
    }   
}

//  REPORTES
export const getSalesByDate = async (req: Request, res: Response) => {
    try {
        let fechaInicio: any = req.query.fechaInicio;
        let fechaFin: any = req.query.fechaFin;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);
        const results = await Sales.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: fechaInicio,
                        $lte: fechaFin
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    currency: { $first: "$currency" },
                    aditional: { $first: "$aditional" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        return ok(res.status(200).json(results));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const salePerDay = async (req: Request, res: Response) => {
    try {
        const resultados = await Sales.aggregate([
            {
                $lookup: {
                    from: "pedidos",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order"
                }
            },
            {
                $unwind: "$order"
            },
            {
                $lookup: {
                    from: "detallepedidos",
                    localField: "order.orderDetail",
                    foreignField: "_id",
                    as: "orderDetail"
                }
            },
            {
                $unwind: "$orderDetail"
            },
            {
                $lookup: {
                    from: "cartas",
                    localField: "orderDetail.Cart",
                    foreignField: "_id",
                    as: "carta"
                }
            },
            {
                $unwind: "$carta"
            },
            {
                $group: {
                    _id: { 
                        name: "$carta.name",
                    },
                    sales:{
                        $push: {
                            name: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
                            value: "$amount"
                        }
                    }
                }
            },
            {
                $sort: { date: -1 }
            }
        ])
        return ok(res.status(200).json(resultados));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const topProductSale = async (req: Request, res: Response) => {
    try {
        const sales = await Sales.find();
        const details = await DetallePedido.find();
        const resultados = await DetallePedido.aggregate([
            {
                $group: {
                    _id: "$Cart",
                    total: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "cartas",
                    localField: "_id",
                    foreignField: "_id",
                    as: "carta"
                }
            },
            {
                $unwind: "$carta"
            },
            {
                $project: {
                    _id: '$_id',
                    name: "$carta.name",
                    total: details.length
                }
            },
            {
                $sort: { total: 1 }
            }
        ])
        return ok(res.status(200).json(resultados));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const detailSaleByDate = async (req: Request, res: Response) => {
    try {
        const results = await DetallePedido.aggregate([
            {
                $lookup: {
                    from: "cartas",
                    localField: "Cart",
                    foreignField: "_id",
                    as: "carta"
                }
            },
            {
                $unwind: "$carta"
            },
            {
                $group: {
                    _id: {
                        carta: "$carta.name"
                    },
                    data:{
                        $push: {
                            name: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            value: { $sum: "$quantity"}
                        }
                    }
                }
            },
            {
                $sort: { "_id.fecha": 1, "_id.carta": 1 }
            }
        ]);
        return ok(res.status(200).json(results));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const countDetailsByCategory = async (req: Request, res: Response) => {
    try {
        const results = await DetallePedido.aggregate([
            {
                $lookup: {
                    from: "cartas",
                    localField: "Cart",
                    foreignField: "_id",
                    as: "carta"
                }
            },
            {
                $unwind: "$carta"
            },
            {
                $group: {
                    _id: "$carta.category.name",
                    total: { $sum: "$quantity" }
                }
            },
            {
                $sort: { total: 1 }
            }
        ]);
        return ok(res.status(200).json(results));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const totalSalesByClient = async (req: Request, res: Response) => {
    try {
        let fechaInicio: any = req.query.fechaInicio;
        let fechaFin: any = req.query.fechaFin;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);
        const results = await Sales.aggregate([
            {
                $lookup: {
                    from: "pedidos",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "pedido"
                }
            },
            {
                $unwind: "$pedido"
            },
            {
                $group: {
                    _id: { 
                        name: "$pedido.client.name",
                    },
                    series: {
                        $push: {
                            name: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
                            value: "$amount"
                        }
                    },
                }
            },
            {
                $sort: { "series.name": 1 }
            }
        ]);
        return ok(res.status(200).json(results));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}


export const getReceipts = async (req: Request, res: Response) => {
    try {
        const receipts: IReceipt[] = await Receipt.find();
        let _sales: ISales[] = await Sales.find();
        const mapp = receipts.map((rc) => {
            const sale = _sales.find((s) => s.slug === rc.payment.slug);
            return {
                _id: rc._id,
                paymentCode: sale.paymentId,
                orderId: rc.orderId,
                igv: rc.igv,
                subtotal: rc.subtotal,
                discount: rc.discount,
                aditional: sale.aditional,
                total: rc.total.toFixed(2),
                state: sale.status,
                receiptNumber: rc.receiptNumber,
            };
        })
        return ok(res.status(200).json(mapp));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const getReceiptTById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const receipt = await Receipt.findById(id);
        const sale = await Sales.findOne({ slug: receipt.payment.slug });
        const order = await Pedido.findById(receipt.orderId);

        const cartasPromise = order.orderDetail.map(async (od) => {
            const dt = await DetallePedido.findById(od);
            const carta = await Carta.findById(dt.Cart);
            return {
                name: carta.name,
                quantity: dt.quantity,
                price: carta.price
            }
        })

        const cartas = await Promise.all(cartasPromise);
        const mapp = {
            _id: receipt._id,
            paymentCode: sale.paymentId,
            order: {
                _id: order._id,
                _client: order.client.name,
            },
            cartas: cartas,
            igv: receipt.igv,
            subtotal: receipt.subtotal,
            discount: receipt.discount,
            aditional: sale.aditional,
            total: receipt.total.toFixed(2),
            state: receipt.state,
            receiptNumber: receipt.receiptNumber,
            fecha_emision: receipt.createdAt
        }
        return ok(res.status(200).json(mapp));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

