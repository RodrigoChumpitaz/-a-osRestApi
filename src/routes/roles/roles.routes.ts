import { Router } from "express";
import passport from "passport";
import validate from "../../middlewares/checkout";
import { addRols, rolesList } from "../../controller/roles/roles.controller";

const router = Router();

router.get('/', rolesList)
router.post('/addRol', addRols)


export default router;