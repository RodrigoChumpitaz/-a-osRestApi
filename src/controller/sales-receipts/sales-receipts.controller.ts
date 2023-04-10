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