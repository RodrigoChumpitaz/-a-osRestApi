import { Router } from "express";
import validate from "../../middlewares/checkout";
import { addpermission, permissionList } from "../../controller/permission/permission.controller";

const router = Router();

router.get('/', validate, permissionList)
router.post('/addPermission', validate, addpermission)

export default router;