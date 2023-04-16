"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const distritos_controller_1 = require("../../controller/common/distritos.controller");
const router = (0, express_1.Router)();
router.get('/distritos', checkout_1.default, distritos_controller_1.getDistritosLima);
router.post('/addMasive', checkout_1.default, distritos_controller_1.addDistritosMasive);
exports.default = router;
