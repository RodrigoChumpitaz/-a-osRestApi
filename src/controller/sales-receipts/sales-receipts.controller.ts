import { Request, Response } from 'express';
import Receipt from '../../model/receipt';
import pdf from 'html-pdf';
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

const ubicacion = require.resolve("../../../factura.html");
let htmlContent = fs.readFileSync(ubicacion, 'utf8');
const formater = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });


export const generatedReceipts = async (req: Request, res: Response) => {
    try {
        // if(ubicacion) return ok(res.status(200).send(ubicacion));
        const { receiptId } = req.params;
        let table = '';
        const receipt: IReceipt = await Receipt.findById(receiptId);
        if(!receipt || receipt === null) return err(res.status(404).json({ message: 'No se encontro el recibo' }));
        const order: IPedido = await Pedido.findById(receipt.orderId);
        const user: IUser = await User.findById(order.client.id);
        const sale: ISales = await Sales.findById(receipt.payment.id);
        for(let dt of order.orderDetail) {
            let detail: IDetallePedido = await DetallePedido.findById(dt);
            let cart: ICarta = await Carta.findById(detail.Cart);
            const importe = cart.price * detail.quantity;
            table += `
                <tr>
                    <td>${cart.name}</td>
                    <td>${detail.quantity}</td>
                    <td>${formater.format(cart.price)}</td>
                    <td>${formater.format(importe)}</td>
                </tr>>
            `
        }
        htmlContent = htmlContent.replace('{{nro_recibo}}', receipt.receiptNumber.toString());
        htmlContent = htmlContent.replace('{{fecha_recibo}}', receipt.createdAt);
        htmlContent = htmlContent.replace('{{tablaCarta}}', table);
        htmlContent = htmlContent.replace('{{cliente}}', `${user.name} ${user.lastname}`);
        htmlContent = htmlContent.replace("{{subtotal}}", formater.format(receipt.subtotal));
        htmlContent = htmlContent.replace("{{descuento}}", formater.format(receipt.discount));
        htmlContent = htmlContent.replace("{{subtotalConDescuento}}", formater.format(receipt.subtotal - receipt.discount));
        htmlContent = htmlContent.replace("{{adicional}}", formater.format(sale.aditional));
        htmlContent = htmlContent.replace("{{impuestos}}", formater.format(receipt.igv));
        htmlContent = htmlContent.replace("{{total}}", formater.format(receipt.total));
        pdf.create(htmlContent).toStream((error, stream) => {
            if(error) return err(res.status(500).json({ message: error.message }));
            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-disposition', `inline; filename="recibo-${sale.slug}.pdf"`);
            stream.pipe(res);
        });
        // return ok(res.status(200).json(receipt));
    } catch (error) {
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
        if(fechaInicio === null || fechaFin === null) {
            const sales = await Sales.find();
            return ok(res.status(200).json(sales));
        }
        const sales = await Sales.find({ createdAt: { $gte: fechaInicio, $lt: fechaFin } }).select('-__v -updatedAt');
        return ok(res.status(200).json(sales));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}

export const salePerDay = async (req: Request, res: Response) => {
    try {
        const resultados = await Sales.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
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
                        fecha: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        carta: "$carta.name"
                    },
                    total: { $sum: "$quantity" },
                    cantidadVentas: { $sum: 1 }
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
            // {
            //     $match: {
            //         fecha: { $gte: new Date('2023-04-08'), $lt: new Date('2023-04-11') }
            //     }
            // },
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
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    cliente: { $first: "$pedido.client.name" },
                    monto: { $sum: "$amount" },
                    ventas: { $sum: 1 }
                }
            },
            {
                $sort: { ventas: -1 }
            }
        ]);
        return ok(res.status(200).json(results));
    } catch (error) {
        return err(res.status(500).json({ message: error.message }));
    }
}