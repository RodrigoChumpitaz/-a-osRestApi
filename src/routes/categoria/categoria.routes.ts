import { Router } from "express";
import { mimetypes, upload, UploadBuilder } from "../../middlewares/Upload";
import { addCategoria, categoryById, changeStateToCategory, getCategorias, searchCategory, updateCategory } from "../../controller/categoria/categoria.controller";
import validate from "../../middlewares/checkout";

const router: Router = Router();


router.get("/getCategories", getCategorias);
router.post("/addCategory", validate, upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("categoryImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), addCategoria)
router.get("/searchCategory/:description", searchCategory)
router.get("/categoryById/:id", categoryById)
router.patch("/changeState/:id", validate, changeStateToCategory)
router.patch("/updateCategory/:slug", validate, upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("categoryImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), updateCategory)

export default router;