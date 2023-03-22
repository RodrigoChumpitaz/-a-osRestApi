import { Router } from "express";
import validate from "../../middlewares/checkout";
import { createOrder, getOrders, getOrdersByUser } from "../../controller/orders/pedidos/pedidos.controller";

const router: Router = Router();

router.get('/orders', validate ,getOrders)
router.post('/createOrder', createOrder)
router.get('/ordersByUser/:id', getOrdersByUser)

export default router;