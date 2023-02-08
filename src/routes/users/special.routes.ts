import { Router }  from "express";
import validate from "../../middlewares/checkout";
import { userList } from "../../controller/users/user.controller";

const router = Router();

router.get('/special', validate ,userList)

export default router;