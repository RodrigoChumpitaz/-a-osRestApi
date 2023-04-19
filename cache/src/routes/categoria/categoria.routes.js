"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Upload_1 = require("../../middlewares/Upload");
const categoria_controller_1 = require("../../controller/categoria/categoria.controller");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const router = (0, express_1.Router)();
router.get("/getCategories", categoria_controller_1.getCategorias);
router.post("/addCategory", checkout_1.default, Upload_1.upload.save(new Upload_1.UploadBuilder()
    .addMaxSize(5000000)
    .addFieldName("categoryImage")
    .addAllowedMimeTypes(Upload_1.mimetypes)
    .addIsPublic(true)
    .build()), categoria_controller_1.addCategoria);
router.get("/searchCategory/:description", categoria_controller_1.searchCategory);
router.get("/categoryById/:id", categoria_controller_1.categoryById);
router.patch("/changeState/:id", checkout_1.default, categoria_controller_1.changeStateToCategory);
router.patch("/updateCategory/:slug", checkout_1.default, Upload_1.upload.save(new Upload_1.UploadBuilder()
    .addMaxSize(5000000)
    .addFieldName("categoryImage")
    .addAllowedMimeTypes(Upload_1.mimetypes)
    .addIsPublic(true)
    .build()), categoria_controller_1.updateCategory);
exports.default = router;
