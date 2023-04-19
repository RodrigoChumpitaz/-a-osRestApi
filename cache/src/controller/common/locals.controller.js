"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inactiveLocal = exports.updateLocal = exports.getLocalByDistrict = exports.getLocalByData = exports.addLocal = exports.getLocals = void 0;
const neverthrow_1 = require("neverthrow");
const verificarToken_1 = __importDefault(require("../../helpers/verificarToken"));
const distritos_1 = __importDefault(require("../../model/distritos"));
const local_1 = __importDefault(require("../../model/local"));
const verificar = new verificarToken_1.default();
const getLocals = async (req, res) => {
    try {
        const { user_token } = req.headers;
        if (user_token) {
            const locals = await local_1.default.find();
            return (0, neverthrow_1.ok)(res.status(200).json(locals));
        }
        const locals = await local_1.default.find({ active: true });
        return (0, neverthrow_1.ok)(res.status(200).json(locals));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getLocals = getLocals;
const addLocal = async (req, res) => {
    try {
        const { telefono, direccion, distrito } = req.body;
        const isAdmin = await verificar.isAdmin(req);
        if (!isAdmin)
            return res.status(401).json({ msg: 'The user dont have authorization to this action' });
        const distritoByName = await distritos_1.default.findOne({ nombre: distrito }).select('-__v -createdAt -updatedAt');
        if (!distritoByName)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Distric not found' }));
        const newLocal = new local_1.default({ telefono, direccion, distrito: { id: distritoByName.id, slug: distritoByName.slug, name: distritoByName.nombre } });
        await newLocal.save();
        await distritos_1.default.findByIdAndUpdate(distritoByName._id, { $push: { locals: newLocal } });
        await distritoByName.save();
        return (0, neverthrow_1.ok)(res.status(200).json({
            message: 'Local added',
            local: newLocal,
            distrito: {
                msg: 'Local added to distrito',
                distrito: distritoByName
            }
        }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.addLocal = addLocal;
const getLocalByData = async (req, res) => {
    try {
        const { data } = req.params;
        const local = await local_1.default.findOne({
            $or: [
                { slug: data },
                { telefono: data },
                { direccion: data },
            ]
        }).select('-__v -createdAt -updatedAt');
        if (!local)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Local not found' }));
        return (0, neverthrow_1.ok)(res.status(200).json(local));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getLocalByData = getLocalByData;
const getLocalByDistrict = async (req, res) => {
    try {
        const { district } = req.params;
        const locals = await local_1.default.find({
            'distrito.name': district
        }).select('-__v -distrito.id -distrito.slug -createdAt -updatedAt');
        if (!locals || locals.length == 0)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Local not found because the district is incorrect or doesnt exist' }));
        return (0, neverthrow_1.ok)(res.status(200).json(locals));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getLocalByDistrict = getLocalByDistrict;
const updateLocal = async (req, res) => {
    try {
        const { id } = req.params;
        const { telefono, direccion, distrito } = req.body;
        const local = await local_1.default.findById(id).select('-__v -createdAt -updatedAt');
        const distritoActual = await distritos_1.default.findById(local.distrito.id).select('-__v -createdAt -updatedAt');
        const distric = await distritos_1.default.findOne({ nombre: distrito }).select('-__v -createdAt -updatedAt');
        if (distritoActual.nombre != distric.nombre) {
            await distritos_1.default.findByIdAndUpdate(distritoActual._id, { $pull: { locals: local.id } });
            await distritos_1.default.findByIdAndUpdate(distric._id, { $push: { locals: local } });
        }
        local.telefono = telefono;
        local.direccion = direccion;
        local.distrito = { id: distric.id, slug: distric.slug, name: distric.nombre };
        await local.save();
        return (0, neverthrow_1.ok)(res.status(200).json({
            message: 'Local updated',
            local: local,
        }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.updateLocal = updateLocal;
const inactiveLocal = async (req, res) => {
    try {
        const { id } = req.params;
        const localById = await local_1.default.findById(id).select('-__v -createdAt -updatedAt');
        if (!localById)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Local not found' }));
        await local_1.default.findByIdAndUpdate(id, { active: false });
        if (localById.active === false) {
            await local_1.default.findByIdAndUpdate(id, { active: true });
            return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Local active' }));
        }
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Local inactive' }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.inactiveLocal = inactiveLocal;
