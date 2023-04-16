"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentType_1 = __importDefault(require("../../../model/documentType"));
const neverthrow_1 = require("neverthrow");
const verificarToken_1 = __importDefault(require("../../../helpers/verificarToken"));
const router = (0, express_1.Router)();
const verificar = new verificarToken_1.default();
// router.use(validate);
router.get("/getDocTypes", async (req, res) => {
    const data = await documentType_1.default.find();
    return (0, neverthrow_1.ok)(res.status(200).json(data));
});
router.post("/addDocType", async (req, res) => {
    try {
        const isAdmin = await verificar.isAdmin(req);
        if (!isAdmin)
            return res.status(401).json({ msg: 'The user dont have authorization' });
        const { type } = req.body;
        if (!type)
            return res.status(400).json({ message: "Type is required" });
        const newDocType = new documentType_1.default({ type });
        await newDocType.save();
        return (0, neverthrow_1.ok)(res.status(200).json({
            message: "Document type created",
            data: newDocType
        }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
});
exports.default = router;
