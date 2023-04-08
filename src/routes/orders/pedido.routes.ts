import { Router } from "express";
import validate from "../../middlewares/checkout";
import { confirmOrder, createOrder, getOrders, getOrdersByStatus, getOrdersByUser, updateOrder } from "../../controller/orders/pedidos/pedidos.controller";
import { Upload, UploadBuilder, mimetypes } from "../../middlewares/Upload";

const router: Router = Router();

const upload = new Upload();

router.get('/orders', validate ,getOrders)
router.post('/createOrder', createOrder)
router.get('/ordersByUser/:id', getOrdersByUser)
router.patch('/updateOrder/:id', validate, updateOrder)
router.get('/ordersByStatus/:status', validate, getOrdersByStatus)
router.patch('/confirmOrder/:id', upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("orderImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), confirmOrder)

export default router;