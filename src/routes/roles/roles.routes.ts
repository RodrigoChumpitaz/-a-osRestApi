import { Router } from "express";
import validate from "../../middlewares/checkout";
import { addRols, rolesList } from "../../controller/roles/roles.controller";

const router = Router();

router.get('/', validate, rolesList)
router.post('/addRol', validate, addRols)


export default router;