"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const permission_controller_1 = require("../../controller/permission/permission.controller");
const router = (0, express_1.Router)();
router.use(checkout_1.default);
router.get('/', permission_controller_1.permissionList);
router.post('/addPermission', permission_controller_1.addpermission);
exports.default = router;
