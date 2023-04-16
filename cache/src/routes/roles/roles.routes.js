"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const roles_controller_1 = require("../../controller/roles/roles.controller");
const router = (0, express_1.Router)();
router.use(checkout_1.default);
router.get('/', roles_controller_1.rolesList);
router.post('/addRol', roles_controller_1.addRols);
exports.default = router;
