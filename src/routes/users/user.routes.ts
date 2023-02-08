import { Router } from "express";
import validate from "../../middlewares/checkout";
import { cambiarPassword, comprobarToken, confirmedUser, olvidePassword, perfil, signin, signup } from "../../controller/users/user.controller";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/confirmed/:token", confirmedUser);
router.get('/perfil', validate, perfil);
router.post("/olvidePassword", olvidePassword);
router.route("/cambiarPassword/:new_token").get(comprobarToken).put(cambiarPassword);


export default router;