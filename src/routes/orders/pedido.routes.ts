import { Router } from "express";
import validate from "../../middlewares/checkout";
import {  addAllCartsToCarrito, cancelOrder, confirmOrder, finalizedDeliveryOrder, finalizedOrder, getCarritoByUser, getOrderEntregado, getOrderToDeliver, getOrders, getOrdersByStatus, getOrdersByUser, paidOrder, updateOrder } from "../../controller/orders/pedidos/pedidos.controller";
import { Upload, UploadBuilder, mimetypes } from "../../middlewares/Upload";

const router: Router = Router();

const upload = new Upload();

router.get('/orders', validate ,getOrders)
router.get('/ordersByUser/:id', getOrdersByUser)
router.get('/ordersToDeliver', getOrderToDeliver)
router.patch('/cancelOrder/:id', cancelOrder)
router.get('/ordersToDeliverEntregado', getOrderEntregado)
router.get('/ordersByStatus/:status', validate, getOrdersByStatus)
router.patch('/updateOrder/:id', validate, updateOrder)
router.patch('/confirmOrder/:id', upload.save(
    new UploadBuilder()
    .addMaxSize(5000000)
    .addFieldName("orderImage")
    .addAllowedMimeTypes(mimetypes)
    .addIsPublic(true)
    .build()
    ), confirmOrder)

/* FLUJO DE CARRITO */
router.get('/get-carrito', getCarritoByUser)
router.post('/add-carrito-to-user', addAllCartsToCarrito)
// router.delete('/delete-cart-to-carrito/:id', deleteCartTorCarrito)

/* PAGOS */
router.post('/paid-order', paidOrder)
router.post('/finalized-order/:orderId', finalizedOrder)
router.post('/finalized-delivery-order/:orderId', finalizedDeliveryOrder)

export default router;