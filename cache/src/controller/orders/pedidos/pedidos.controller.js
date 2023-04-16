"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizedDeliveryOrder = exports.finalizedOrder = exports.paidOrder = exports.addAllCartsToCarrito = exports.getCarritoByUser = exports.getOrdersByStatus = exports.updateOrder = exports.confirmOrder = exports.getOrdersByUser = exports.getOrders = void 0;
const user_1 = __importDefault(require("../../../model/user"));
const pedido_1 = __importDefault(require("../../../model/pedido"));
const neverthrow_1 = require("neverthrow");
const verificarToken_1 = __importDefault(require("../../../helpers/verificarToken"));
const detallePedido_1 = __importDefault(require("../../../model/detallePedido"));
const carta_1 = __importDefault(require("../../../model/carta"));
const sales_1 = __importDefault(require("../../../model/sales"));
const receipt_1 = __importDefault(require("../../../model/receipt"));
const get_all_receipts_1 = require("../../../helpers/get-all-receipts");
const verificar = new verificarToken_1.default();
const getOrders = async (req, res) => {
    try {
        const pedidos = await pedido_1.default.find().select('-__v -createdAt -updatedAt')
            .populate({ path: 'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } });
        return (0, neverthrow_1.ok)(res.status(200).json(pedidos));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getOrders = getOrders;
const getOrdersByUser = async (req, res) => {
    try {
        const { id } = req.params;
        const ordersByUser = await pedido_1.default.find({ 'client.id': id });
        return (0, neverthrow_1.ok)(res.status(200).json(ordersByUser));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getOrdersByUser = getOrdersByUser;
const confirmOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const orderToConfirm = await pedido_1.default.findById(id);
        let estadoActual = orderToConfirm.status;
        if (estadoActual === 'Entregado') {
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'El pedido ya fue entregado' }));
        }
        if (estadoActual === 'Invalidado') {
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'El pedido fue invalidado' }));
        }
        if (req.file) {
            const file = req.file;
            orderToConfirm.imgPrueba = file.location;
        }
        else {
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'La imagen de prueba es obligatoria' }));
        }
        orderToConfirm.status = 'Entregado';
        await orderToConfirm.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Pedido confirmado' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.confirmOrder = confirmOrder;
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const {} = req.body;
        const orderById = await pedido_1.default.findById(id).populate({ path: 'orderDetail', select: 'detail Cart quantity', populate: { path: 'Cart', select: 'category.name name price descrption' } }).select('-__v -createdAt -updatedAt -client.id -client.slug -slug');
        if (!orderById || orderById === null)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No se encontró el pedido' }));
        orderById.orderDetail.forEach(async (detail) => {
            let orderTail = await detallePedido_1.default.findById(detail);
            console.log(orderTail);
        });
        return (0, neverthrow_1.ok)(res.status(200).json(orderById));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.updateOrder = updateOrder;
const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const objOrders = await pedido_1.default.find({ status }).select('-__v -createdAt -updatedAt');
        if (objOrders.length === 0)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No se encontraron resultados' }));
        return (0, neverthrow_1.ok)(res.status(200).json(objOrders));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getOrdersByStatus = getOrdersByStatus;
/* FLUJO DE CARRITO E INICIO DEL PEDIDO */
const getCarritoByUser = async (req, res) => {
    try {
        const { user_token } = req.headers;
        const user = await verificar.decodeToken(user_token);
        if (user.carrito.length === 0)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No hay platos en el carrito :(' }));
        const carrito = await carta_1.default.find({ _id: { $in: user.carrito } }).select('-__v -createdAt -updatedAt');
        return (0, neverthrow_1.ok)(res.status(200).json(carrito));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getCarritoByUser = getCarritoByUser;
const addAllCartsToCarrito = async (req, res) => {
    try {
        const { values } = req.body;
        const { user_token } = req.headers;
        const user = await verificar.decodeToken(user_token);
        if (!user || user === null)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No se encontró el usuario' }));
        await user_1.default.findByIdAndUpdate(user._id, { carrito: values });
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Platos agregados al carrito' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.addAllCartsToCarrito = addAllCartsToCarrito;
/* Flujo de pagos y creacion de ventas */
const paidOrder = async (req, res) => {
    try {
        const { charge, orderId } = req.body;
        const _order = await pedido_1.default.findById(orderId);
        if (!_order || _order === null)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No hay un pedido pendiente' }));
        if (_order.status === 'Pagado' || _order.status === 'Por entregar')
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'El pedido ya fue pagado' }));
        const data = charge;
        if (!data.id) {
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'No se pudo procesar el pago' }));
        }
        const orderAmount = data.amount.toString().substring(0, data.amount.toString().length - 2) + ".00";
        const newSale = new sales_1.default({ orderId: orderId, amount: orderAmount, currency: data.currency_code, paymentId: data.id });
        await pedido_1.default.findByIdAndUpdate(orderId, { status: 'Pagado' });
        await user_1.default.findByIdAndUpdate(_order.client.id, { carrito: [] });
        await newSale.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Pago procesado correctamente' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.paidOrder = paidOrder;
const finalizedOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const _sale = await sales_1.default.findOne({ orderId });
        const _order = await pedido_1.default.findById(orderId);
        if (_order.status === 'Por entregar')
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'El pedido ya fue finalizado' }));
        const newReceipt = new receipt_1.default({ orderId, payment: { id: _sale._id, slug: _sale.slug }, igv: 1.18, subtotal: _sale.amount, total: _sale.amount * 1.18, receiptNumber: await (0, get_all_receipts_1.getReceiptsLenght)() + 1 });
        await pedido_1.default.findByIdAndUpdate(orderId, { status: 'Por entregar' });
        await newReceipt.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Pedido finalizado correctamente' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.finalizedOrder = finalizedOrder;
const finalizedDeliveryOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { phoneNumber, reference } = req.body;
        const _order = await pedido_1.default.findById(orderId);
        if (!_order || _order === null)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No se encontró el pedido' }));
        let detail;
        let cart;
        let subtotal = 0;
        if (_order.status === 'Entregado')
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'El pedido ya fue finalizado' }));
        _order.observation = _order.observation + ` - ${phoneNumber}, ${reference}`;
        _order.status = 'Por entregar';
        for (let i in _order.orderDetail) {
            detail = await detallePedido_1.default.findById(_order.orderDetail[i]);
            cart = await carta_1.default.findById(detail.Cart);
            subtotal += cart.price * detail.quantity;
        }
        const newSale = new sales_1.default({ orderId: orderId, amount: subtotal, currency: "PEN", paymentId: null, aditional: 10.00 });
        await user_1.default.findByIdAndUpdate(_order.client.id, { carrito: [] });
        await newSale.save();
        const newReceipt = new receipt_1.default({ orderId, payment: { id: newSale._id, slug: newSale.slug }, igv: 1.18, subtotal: newSale.amount, total: (newSale.amount * 1.18 + newSale.aditional).toFixed(2), receiptNumber: await (0, get_all_receipts_1.getReceiptsLenght)() + 1 });
        await newReceipt.save();
        await _order.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Pedido finalizado correctamente' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.finalizedDeliveryOrder = finalizedDeliveryOrder;
