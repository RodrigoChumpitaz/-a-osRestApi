"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmailBot_1 = require("./EmailBot");
const router = (0, express_1.Router)();
router.post('/enviar-email', EmailBot_1.sendMail);
exports.default = router;
