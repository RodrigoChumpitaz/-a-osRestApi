"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetailByOrder = exports.createOrderDetail = void 0;
const carta_1 = __importDefault(require("../../../model/carta"));
const pedido_1 = __importDefault(require("../../../model/pedido"));
const neverthrow_1 = require("neverthrow");
const detallePedido_1 = __importDefault(require("../../../model/detallePedido"));
const verificarToken_1 = __importDefault(require("../../../helpers/verificarToken"));
const verificar = new verificarToken_1.default();
const createOrderDetail = async (req, res) => {
    try {
        const { user_token } = req.headers;
        let { deliveryDate, observation, data, saleType } = req.body;
        saleType = saleType.toString().toLowerCase();
        const user = await verificar.decodeToken(user_token);
        let cartByName;
        let newOrder = new pedido_1.default({ deliveryDate: new Date(deliveryDate), client: { id: user._id, name: user.name, email: user.email, slug: user.slug }, observation, saleType });
        await newOrder.save();
        data.forEach(async (dt) => {
            let centinel = false;
            cartByName = await carta_1.default.findOne({ name: dt.Cart });
            let newOrderDetail = new detallePedido_1.default({ order: newOrder._id, Cart: cartByName._id, quantity: dt.quantity });
            if (centinel === false) {
                await newOrderDetail.save();
            }
            await pedido_1.default.findByIdAndUpdate(newOrder._id, { $push: { orderDetail: newOrderDetail._id } });
            centinel = true;
        });
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Detalle de pedido creado', orderId: newOrder._id }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.createOrderDetail = createOrderDetail;
const getOrderDetailByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const ordersDetails = await detallePedido_1.default.find({ order: orderId }).select('-__v -createdAt -updatedAt').populate('Cart', 'category.name name price description imgUrl _id').populate('order', '-__v -orderDetail -slug -imgPrueba -client.slug -client.name -client.name -createdAt -updatedAt');
        if (!ordersDetails || ordersDetails.length === 0) {
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'No se encontraron detalles de pedidos' }));
        }
        return (0, neverthrow_1.ok)(res.status(200).json(ordersDetails));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getOrderDetailByOrder = getOrderDetailByOrder;
