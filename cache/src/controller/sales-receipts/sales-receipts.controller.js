"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptTById = exports.getReceipts = exports.totalSalesByClient = exports.countDetailsByCategory = exports.detailSaleByDate = exports.topProductSale = exports.salePerDay = exports.getSalesByDate = exports.generatedReceipts = void 0;
const receipt_1 = __importDefault(require("../../model/receipt"));
const neverthrow_1 = require("neverthrow");
const pedido_1 = __importDefault(require("../../model/pedido"));
const detallePedido_1 = __importDefault(require("../../model/detallePedido"));
const carta_1 = __importDefault(require("../../model/carta"));
const sales_1 = __importDefault(require("../../model/sales"));
const generatedReceipts = async (req, res) => {
    try {
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'ok' }));
    }
    catch (error) {
        // console.log(error);
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
                $sort: { date: -1 }
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
const getReceipts = async (req, res) => {
    try {
        const receipts = await receipt_1.default.find();
        let _sales = await sales_1.default.find();
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
        });
        return (0, neverthrow_1.ok)(res.status(200).json(mapp));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getReceipts = getReceipts;
const getReceiptTById = async (req, res) => {
    try {
        const { id } = req.params;
        const receipt = await receipt_1.default.findById(id);
        const sale = await sales_1.default.findOne({ slug: receipt.payment.slug });
        const order = await pedido_1.default.findById(receipt.orderId);
        const cartasPromise = order.orderDetail.map(async (od) => {
            const dt = await detallePedido_1.default.findById(od);
            const carta = await carta_1.default.findById(dt.Cart);
            return {
                name: carta.name,
                quantity: dt.quantity,
                price: carta.price
            };
        });
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
        };
        return (0, neverthrow_1.ok)(res.status(200).json(mapp));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getReceiptTById = getReceiptTById;
