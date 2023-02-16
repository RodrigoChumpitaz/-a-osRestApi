import { Router } from "express";
import { addDistritosMasive, getDistritosLima } from "../../controller/common/distritos.controller";

const router: Router = Router();


router.get('/distritos', getDistritosLima);
router.post('/addMasive', addDistritosMasive)

export default router;