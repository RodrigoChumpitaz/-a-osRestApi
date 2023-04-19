"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const pedidos_controller_1 = require("../../controller/orders/pedidos/pedidos.controller");
const Upload_1 = require("../../middlewares/Upload");
const router = (0, express_1.Router)();
const upload = new Upload_1.Upload();
router.get('/orders', checkout_1.default, pedidos_controller_1.getOrders);
router.get('/ordersByUser/:id', pedidos_controller_1.getOrdersByUser);
router.get('/ordersToDeliver', pedidos_controller_1.getOrderToDeliver);
router.patch('/cancelOrder/:id', pedidos_controller_1.cancelOrder);
router.get('/ordersToDeliverEntregado', pedidos_controller_1.getOrderEntregado);
router.get('/ordersByStatus/:status', checkout_1.default, pedidos_controller_1.getOrdersByStatus);
router.patch('/updateOrder/:id', checkout_1.default, pedidos_controller_1.updateOrder);
router.patch('/confirmOrder/:id', upload.save(new Upload_1.UploadBuilder()
    .addMaxSize(5000000)
    .addFieldName("orderImage")
    .addAllowedMimeTypes(Upload_1.mimetypes)
    .addIsPublic(true)
    .build()), pedidos_controller_1.confirmOrder);
/* FLUJO DE CARRITO */
router.get('/get-carrito', pedidos_controller_1.getCarritoByUser);
router.post('/add-carrito-to-user', pedidos_controller_1.addAllCartsToCarrito);
// router.delete('/delete-cart-to-carrito/:id', deleteCartTorCarrito)
/* PAGOS */
router.post('/paid-order', pedidos_controller_1.paidOrder);
router.post('/finalized-order/:orderId', pedidos_controller_1.finalizedOrder);
router.post('/finalized-delivery-order/:orderId', pedidos_controller_1.finalizedDeliveryOrder);
exports.default = router;
