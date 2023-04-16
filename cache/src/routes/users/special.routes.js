"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const user_controller_1 = require("../../controller/users/user.controller");
const router = (0, express_1.Router)();
router.get('/special', checkout_1.default, user_controller_1.userList);
router.patch('/special/update-user/:id', checkout_1.default, user_controller_1.updateUserById);
router.patch('/special/change-user-status/:id', checkout_1.default, user_controller_1.changeUserStatus);
exports.default = router;
