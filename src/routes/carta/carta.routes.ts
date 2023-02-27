import { Router } from "express";
import { mimetypes, upload, UploadBuilder } from "../../middlewares/Upload";
import { addCart, changeAvailable, getCarts, searchCart, updateCart } from "../../controller/carta/carta.controller";

const router: Router = Router();

router.get("/getCart", getCarts);
router.post("/addCart", upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("cartImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
),addCart)
router.get("/getCartByData/:data", searchCart)
router.patch("/unvailableCart/:id", changeAvailable)
router.patch("/updateCart/:slug", upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("cartImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), updateCart)


export default router;