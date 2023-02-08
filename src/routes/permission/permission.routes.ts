import { Router } from "express";
import validate from "../../middlewares/checkout";
import { addpermission, permissionList } from "../../controller/permission/permission.controller";

const router = Router();

router.get('/', permissionList)
router.post('/addPermission', addpermission)

export default router;