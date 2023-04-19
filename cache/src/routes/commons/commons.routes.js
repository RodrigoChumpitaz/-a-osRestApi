"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distritos_controller_1 = require("../../controller/common/distritos.controller");
const router = (0, express_1.Router)();
router.get('/distritos', distritos_controller_1.getDistritosLima);
router.post('/addMasive', distritos_controller_1.addDistritosMasive);
exports.default = router;
