import { Router } from "express";
import validate from "../../middlewares/checkout";
import { addDistritosMasive, getDistritosLima } from "../../controller/common/distritos.controller";

const router: Router = Router();


router.get('/distritos', validate, getDistritosLima);
router.post('/addMasive', validate, addDistritosMasive)

export default router;