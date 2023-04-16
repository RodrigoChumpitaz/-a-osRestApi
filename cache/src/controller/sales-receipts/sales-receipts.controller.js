"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalSalesByClient = exports.countDetailsByCategory = exports.detailSaleByDate = exports.topProductSale = exports.salePerDay = exports.getSalesByDate = exports.generatedReceipts = void 0;
const receipt_1 = __importDefault(require("../../model/receipt"));
const html_pdf_1 = __importDefault(require("html-pdf"));
const fs_1 = __importDefault(require("fs"));
const neverthrow_1 = require("neverthrow");
const pedido_1 = __importDefault(require("../../model/pedido"));
const detallePedido_1 = __importDefault(require("../../model/detallePedido"));
const carta_1 = __importDefault(require("../../model/carta"));
const sales_1 = __importDefault(require("../../model/sales"));
const user_1 = __importDefault(require("../../model/user"));
const ubicacion = require.resolve("../../../factura.html");
let htmlContent = fs_1.default.readFileSync(ubicacion, 'utf8');
const formater = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
const generatedReceipts = async (req, res) => {
    try {
        // if(ubicacion) return ok(res.status(200).send(ubicacion));
        const { receiptId } = req.params;
        let table = '';
        const receipt = await receipt_1.default.findById(receiptId);
        if (!receipt || receipt === null)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No se encontro el recibo' }));
        const order = await pedido_1.default.findById(receipt.orderId);
        const user = await user_1.default.findById(order.client.id);
        const sale = await sales_1.default.findById(receipt.payment.id);
        for (let dt of order.orderDetail) {
            let detail = await detallePedido_1.default.findById(dt);
            let cart = await carta_1.default.findById(detail.Cart);
            const importe = cart.price * detail.quantity;
            table += `
                <tr>
                    <td>${cart.name}</td>
                    <td>${detail.quantity}</td>
                    <td>${formater.format(cart.price)}</td>
                    <td>${formater.format(importe)}</td>
                </tr>>
            `;
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
        html_pdf_1.default.create(htmlContent).toStream((error, stream) => {
            if (error)
                return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
            res.setHeader('Content-type', 'application/pdf');
            res.setHeader('Content-disposition', `inline; filename="recibo-${sale.slug}.pdf"`);
            stream.pipe(res);
        });
        // return ok(res.status(200).json(receipt));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.generatedReceipts = generatedReceipts;
//  REPORTES
const getSalesByDate = async (req, res) => {
    try {
        let fechaInicio = req.query.fechaInicio;
        let fechaFin = req.query.fechaFin;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);
        const results = await sales_1.default.aggregate([
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
        return (0, neverthrow_1.ok)(res.status(200).json(results));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getSalesByDate = getSalesByDate;
const salePerDay = async (req, res) => {
    try {
        const resultados = await sales_1.default.aggregate([
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
                    sales: {
                        $push: {
                            name: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
                            value: "$amount"
                        }
                    }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]);
        return (0, neverthrow_1.ok)(res.status(200).json(resultados));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.salePerDay = salePerDay;
const topProductSale = async (req, res) => {
    try {
        const sales = await sales_1.default.find();
        const details = await detallePedido_1.default.find();
        const resultados = await detallePedido_1.default.aggregate([
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
        ]);
        return (0, neverthrow_1.ok)(res.status(200).json(resultados));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.topProductSale = topProductSale;
const detailSaleByDate = async (req, res) => {
    try {
        const results = await detallePedido_1.default.aggregate([
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
                    data: {
                        $push: {
                            name: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            value: { $sum: "$quantity" }
                        }
                    }
                }
            },
            {
                $sort: { "_id.fecha": 1, "_id.carta": 1 }
            }
        ]);
        return (0, neverthrow_1.ok)(res.status(200).json(results));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.detailSaleByDate = detailSaleByDate;
const countDetailsByCategory = async (req, res) => {
    try {
        const results = await detallePedido_1.default.aggregate([
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
        return (0, neverthrow_1.ok)(res.status(200).json(results));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.countDetailsByCategory = countDetailsByCategory;
const totalSalesByClient = async (req, res) => {
    try {
        let fechaInicio = req.query.fechaInicio;
        let fechaFin = req.query.fechaFin;
        fechaInicio = new Date(fechaInicio);
        fechaFin = new Date(fechaFin);
        const results = await sales_1.default.aggregate([
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
        return (0, neverthrow_1.ok)(res.status(200).json(results));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.totalSalesByClient = totalSalesByClient;
