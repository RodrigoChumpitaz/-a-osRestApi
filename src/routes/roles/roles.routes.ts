import { Router } from "express";
import passport from "passport";
import validate from "../../middlewares/validate";
import { addRols, rolesList } from "../../controller/roles/roles.controller";

const router = Router();

router.get('/', validate ,  rolesList)
router.post('/addRol', validate ,addRols)


export default router;