import { Router } from "express";
import { addLocal, getLocalByData, getLocals, updateLocal } from "../../controller/common/locals.controller";

const router: Router = Router();

router.get('/locals', getLocals)
router.get('/local/:data', getLocalByData)
router.patch('/local/:id', updateLocal)
router.post('/addLocals', addLocal)

export default router;