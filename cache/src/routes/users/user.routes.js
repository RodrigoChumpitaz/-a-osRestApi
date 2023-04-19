"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = __importDefault(require("../../middlewares/checkout"));
const user_controller_1 = require("../../controller/users/user.controller");
const router = (0, express_1.Router)();
router.post("/signup", user_controller_1.signup);
router.post("/signin", user_controller_1.signin);
router.get("/confirmed/:token", user_controller_1.confirmedUser);
router.get('/perfil', checkout_1.default, user_controller_1.perfil);
router.post("/olvidePassword", user_controller_1.olvidePassword);
router.route("/cambiarPassword/:new_token").get(user_controller_1.comprobarToken).put(user_controller_1.cambiarPassword);
exports.default = router;
