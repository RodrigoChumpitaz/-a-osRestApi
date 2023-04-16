"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.changeStateToCategory = exports.categoryById = exports.searchCategory = exports.addCategoria = exports.getCategorias = void 0;
const neverthrow_1 = require("neverthrow");
const categoria_1 = __importDefault(require("../../model/categoria"));
const getCategorias = async (req, res) => {
    try {
        const { user_token } = req.headers;
        if (user_token) {
            const categories = await categoria_1.default.find();
            return (0, neverthrow_1.ok)(res.status(200).json(categories));
        }
        const categories = await categoria_1.default.find({ state: true });
        return (0, neverthrow_1.ok)(res.status(200).json(categories));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getCategorias = getCategorias;
const addCategoria = async (req, res) => {
    try {
        const { description } = req.body;
        if (!description)
            return (0, neverthrow_1.err)(res.status(400).json({ message: 'Description is required' }));
        if (req.file) {
            const file = req.file;
            const newCategoria = new categoria_1.default({ description, imgUrl: file.location });
            await newCategoria.save();
            return (0, neverthrow_1.ok)(res.status(200).json({ msg: 'Category added succesfully', categoria: newCategoria }));
        }
        const newCategoria = new categoria_1.default({ description });
        await newCategoria.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ msg: 'Category added succesfully', categoria: newCategoria }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.addCategoria = addCategoria;
const searchCategory = async (req, res) => {
    try {
        const { description } = req.params;
        const categoryByDecription = await categoria_1.default.find({ description: { $regex: description, $options: 'i' } });
        if (categoryByDecription.length === 0)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Category not found', status: 404 }));
        return (0, neverthrow_1.ok)(res.status(200).json(categoryByDecription));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.searchCategory = searchCategory;
const categoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryById = await categoria_1.default.findById(id);
        if (!categoryById)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Category not found', status: 404 }));
        return (0, neverthrow_1.ok)(res.status(200).json(categoryById));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.categoryById = categoryById;
const changeStateToCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryByData = await categoria_1.default.findById(id);
        if (!categoryByData)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Category not found', status: 404 }));
        if (categoryByData.state === false) {
            await categoria_1.default.findByIdAndUpdate(id, { state: true });
            return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Category activated', status: 200 }));
        }
        await categoria_1.default.findByIdAndUpdate(id, { state: false });
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Category inactivated', status: 200 }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.changeStateToCategory = changeStateToCategory;
const updateCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const { description } = req.body;
        const categoryBySlug = await categoria_1.default.findOne({ slug });
        if (!categoryBySlug)
            return (0, neverthrow_1.err)(res.status(404).json({ message: 'Category not found', status: 404 }));
        if (req.file) {
            const file = req.file;
            categoryBySlug.imgUrl = file.location;
        }
        categoryBySlug.description = description || categoryBySlug.description;
        await categoryBySlug.save();
        return (0, neverthrow_1.ok)(res.status(200).json({ message: 'Category updated', data: categoryBySlug, status: 200 }));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.updateCategory = updateCategory;
