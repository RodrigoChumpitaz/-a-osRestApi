import { Router } from "express";
import { createOrderDetail, getOrderDetailByOrder } from "../../controller/orders/detalle_pedidos/detalle-pedido.controller";

const router: Router = Router();

router.get('/order-detail', )
router.post('/createOrderDetail', createOrderDetail)
router.get('/getOrderDetailByOrder/:orderId', getOrderDetailByOrder)
router.patch('/updateOrderDetail', )
router.patch('/inactiveOrderDetail', )


export default router;