import { Router } from "express";
import validate from "../../middlewares/checkout";
import { addLocal, getLocalByData, getLocalByDistrict, getLocals, updateLocal } from "../../controller/common/locals.controller";

const router: Router = Router();

router.use(validate);

router.get('/locals', getLocals)
router.get('/local/:data', getLocalByData)
router.get('/localByDistrict/:district', getLocalByDistrict)
router.patch('/local/:id', updateLocal)
router.post('/addLocals', addLocal)

export default router;