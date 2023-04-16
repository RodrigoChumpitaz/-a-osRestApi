"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Upload_1 = require("../../middlewares/Upload");
const carta_controller_1 = require("../../controller/carta/carta.controller");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const router = (0, express_1.Router)();
router.get("/getCart", carta_controller_1.getCarts);
router.post("/addCart", checkout_1.default, Upload_1.upload.save(new Upload_1.UploadBuilder()
    .addMaxSize(5000000)
    .addFieldName("cartImage")
    .addAllowedMimeTypes(Upload_1.mimetypes)
    .addIsPublic(true)
    .build()), carta_controller_1.addCart);
router.get("/getCartByData/:data", carta_controller_1.searchCart);
router.get("/getCartByCategory/:category", carta_controller_1.getCartasByCategory);
router.post("/getCartsByIds", carta_controller_1.cartDataByIds);
router.patch("/unvailableCart/:id", checkout_1.default, carta_controller_1.changeAvailable);
router.patch("/updateCart", checkout_1.default, Upload_1.upload.save(new Upload_1.UploadBuilder()
    .addMaxSize(5000000)
    .addFieldName("cartImage")
    .addAllowedMimeTypes(Upload_1.mimetypes)
    .addIsPublic(true)
    .build()), carta_controller_1.updateCart);
exports.default = router;
