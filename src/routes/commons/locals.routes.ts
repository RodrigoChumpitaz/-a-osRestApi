import { Router } from "express";
import validate from "../../middlewares/checkout";
import { addLocal, getLocalByData, getLocalByDistrict, getLocals, updateLocal } from "../../controller/common/locals.controller";

const router: Router = Router();

router.get('/locals', validate, getLocals)
router.get('/local/:data', validate, getLocalByData)
router.get('/localByDistrict/:district', validate, getLocalByDistrict)
router.patch('/local/:id', validate, updateLocal)
router.post('/addLocals', validate, addLocal)

export default router;