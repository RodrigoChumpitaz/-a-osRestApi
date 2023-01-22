import { Router } from "express";
import passport from "passport";
import validate from "../../middlewares/validate";
import { addpermission, permissionList } from "../../controller/permission/permission.controller";

const router = Router();

router.get('/', validate , permissionList)
router.post('/addPermission', addpermission)

export default router;