"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const locals_controller_1 = require("../../controller/common/locals.controller");
const router = (0, express_1.Router)();
router.use(checkout_1.default);
router.get('/locals', locals_controller_1.getLocals);
router.get('/local/:data', locals_controller_1.getLocalByData);
router.get('/localByDistrict/:district', locals_controller_1.getLocalByDistrict);
router.patch('/local/:id', locals_controller_1.updateLocal);
router.patch('/inactiveLocal/:id', locals_controller_1.inactiveLocal);
router.post('/addLocals', locals_controller_1.addLocal);
exports.default = router;
