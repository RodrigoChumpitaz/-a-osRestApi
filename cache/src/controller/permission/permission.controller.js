"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addpermission = exports.permissionList = void 0;
const neverthrow_1 = require("neverthrow");
const verificarToken_1 = __importDefault(require("../../helpers/verificarToken"));
const Permission_1 = __importDefault(require("../../model/Permission"));
const verficar = new verificarToken_1.default();
const permissionList = async (req, res) => {
    try {
        const isEjecutor = await verficar.verificarToken(req);
        if (!isEjecutor)
            return res.status(401).json({ msg: 'You are not authorized to access this resource' });
        const permissions = await Permission_1.default.find();
        return (0, neverthrow_1.ok)(res.status(200).json(permissions));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.permissionList = permissionList;
const addpermission = async (req, res) => {
    try {
        const { name } = req.body;
        if (name.length < 4)
            return res.status(400).json({ msg: 'The name must be at least 4 characters long' });
        const permission = await Permission_1.default.findOne({ name });
        if (permission)
            return res.status(400).json({ msg: 'The permission already exists' });
        const is_admin = await verficar.isAdmin(req);
        if (!is_admin)
            return res.status(401).json({ msg: 'You are not authorized to access this resource because you are not an administrator' });
        const newPermission = new Permission_1.default({ name });
        await newPermission.save();
        return (0, neverthrow_1.ok)(res.status(201).json(newPermission));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.addpermission = addpermission;
