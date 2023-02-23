import { Router } from "express";
import { addCategoria, categoryById, changeStateToCategory, getCategorias, searchCategory, updateCategory } from "../../controller/categoria/categoria.controller";

const router: Router = Router();

router.get("/getCategories", getCategorias);
router.post("/addCategory", addCategoria)
router.get("/searchCategory/:description", searchCategory)
router.get("/categoryById/:id", categoryById)
router.patch("/changeState/:id/:data", changeStateToCategory)
router.patch("/updateCategory/:slug", updateCategory)

export default router;