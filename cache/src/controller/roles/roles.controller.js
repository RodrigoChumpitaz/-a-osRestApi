"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRols = exports.rolesList = void 0;
const neverthrow_1 = require("neverthrow");
const verificarToken_1 = __importDefault(require("../../helpers/verificarToken"));
const rol_1 = __importDefault(require("../../model/rol"));
const verificar = new verificarToken_1.default();
const rolesList = async (req, res) => {
    try {
        const isEjecutor = await verificar.verificarToken(req);
        if (!isEjecutor)
            return res.status(401).json({ msg: 'Unauthorized' });
        const roles = await rol_1.default.find().populate('permissions');
        return (0, neverthrow_1.ok)(res.status(200).json(roles));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.rolesList = rolesList;
const addRols = async (req, res) => {
    try {
        const isAdmin = await verificar.isAdmin(req);
        if (!isAdmin)
            return res.status(401).json({ msg: 'The user dont have authorization to this action' });
        const { rol, permissions } = req.body;
        const rolExists = await rol_1.default.findOne({ rol });
        if (rolExists)
            return res.status(400).json({ msg: 'The rol already exists' });
        const newRol = new rol_1.default({ rol, permissions });
        await newRol.save();
        return (0, neverthrow_1.ok)(res.status(201).json({
            msg: 'Rol created successfully',
            newRol: newRol
        }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.addRols = addRols;
