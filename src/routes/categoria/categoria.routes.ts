import { Router } from "express";
import { mimetypes, upload, UploadBuilder } from "../../middlewares/Upload";
import { addCategoria, categoryById, changeStateToCategory, getCategorias, searchCategory, updateCategory } from "../../controller/categoria/categoria.controller";

const router: Router = Router();


router.get("/getCategories", getCategorias);
router.post("/addCategory", upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("categoryImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), addCategoria)
router.get("/searchCategory/:description", searchCategory)
router.get("/categoryById/:id", categoryById)
router.patch("/changeState/:id", changeStateToCategory)
router.patch("/updateCategory/:slug", upload.save(
    new UploadBuilder()
        .addMaxSize(5000000)
        .addFieldName("categoryImage")
        .addAllowedMimeTypes(mimetypes)
        .addIsPublic(true)
        .build()
), updateCategory)

export default router;