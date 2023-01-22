import { Router }  from "express";
import passport from "passport";
import validate from "../../middlewares/validate";
import { userList } from "../../controller/users/user.controller";

const router = Router();

router.get('/special', validate, userList)

export default router;