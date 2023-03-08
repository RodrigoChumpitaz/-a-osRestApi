import { Router } from "express";
import { mimetypes, upload, UploadBuilder } from "../../middlewares/Upload";
import { addCart, changeAvailable, getCartasByCategory, getCarts, searchCart, updateCart } from "../../controller/carta/carta.controller";
import validate from "../../middlewares/checkout";

const router: Router = Router();

router.get("/getCart", getCarts);
router.post("/addCart", validate, upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("cartImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
),addCart)
router.get("/getCartByData/:data", searchCart)
router.get("/getCartByCategory/:category", getCartasByCategory)
router.patch("/unvailableCart/:id", validate, changeAvailable)
router.patch("/updateCart/:slug", validate, upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("cartImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), updateCart)


export default router;