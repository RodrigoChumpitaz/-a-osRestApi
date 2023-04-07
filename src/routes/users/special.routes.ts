import { Router }  from "express";
import validate from "../../middlewares/checkout";
import { changeUserStatus, updateUserById, userList } from "../../controller/users/user.controller";

const router = Router();

router.get('/special', validate, userList)
router.patch('/special/update-user/:id', validate, updateUserById )
router.patch('/special/change-user-status/:id', validate, changeUserStatus)

export default router;