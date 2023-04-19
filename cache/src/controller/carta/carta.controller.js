"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCart = exports.changeAvailable = exports.getCartasByCategory = exports.cartDataByIds = exports.searchCart = exports.addCart = exports.getCarts = void 0;
const categoria_1 = __importDefault(require("../../model/categoria"));
const carta_1 = __importDefault(require("../../model/carta"));
const dataCategory_1 = require("./dataCategory");
const neverthrow_1 = require("neverthrow");
const getCarts = async (req, res) => {
    try {
        const carts = await carta_1.default.find();
        return res.status(200).json(carts);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getCarts = getCarts;
const addCart = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        if (!name || !price || !description || !category)
            return res.status(400).json({ message: 'All fields are required' });
        const categoryByName = await categoria_1.default.findOne({ description: category });
        if (!categoryByName)
            return res.status(404).json({ message: 'Category not found' });
        const _dataCategory = (0, dataCategory_1.getDataByCategory)(categoryByName);
        if (req.file) {
            const file = req.file;
            const newCart = new carta_1.default({ name, price, description, imgUrl: file.location, category: _dataCategory });
            await newCart.save();
            return res.status(200).json({ message: 'Cart added succesfully', cart: newCart });
        }
        const newCart = new carta_1.default({ name, price, description, category: _dataCategory });
        await newCart.save();
        return res.status(200).json({ message: 'Cart added succesfully', cart: newCart });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.addCart = addCart;
const searchCart = async (req, res) => {
    try {
        const { data } = req.params;
        const cart = await carta_1.default.findOne({ $or: [
                { name: data },
                { description: data },
                { slug: data },
            ] }).select("-category.slug -category.id -createdAt -updatedAt");
        if (!cart || cart === null)
            return res.status(404).json({ message: 'Cart not found' });
        return res.status(200).json(cart);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.searchCart = searchCart;
const cartDataByIds = async (req, res) => {
    try {
        const { dataMap } = req.body;
        const carts = await carta_1.default.find({
            _id: { $in: dataMap }
        }).select("-category.slug -category.id -createdAt -updatedAt");
        return res.json(carts);
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.cartDataByIds = cartDataByIds;
const getCartasByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const carts = await carta_1.default.find({
            'category.name': category, available: true
        }).select("-category.slug -category.id -createdAt -updatedAt");
        if (!carts || carts.length === 0)
            return res.status(404).json({ message: "The Category does'nt exist or is incorrect" });
        return (0, neverthrow_1.ok)(res.status(200).json(carts));
    }
    catch (error) {
        return (0, neverthrow_1.err)(res.status(500).json({ message: error.message }));
    }
};
exports.getCartasByCategory = getCartasByCategory;
const changeAvailable = async (req, res) => {
    try {
        const { id } = req.params;
        const cartById = await carta_1.default.findById(id);
        if (!cartById)
            return res.status(404).json({ message: 'Cart not found' });
        if (cartById.available === true) {
            await carta_1.default.findByIdAndUpdate(id, { available: false });
            return res.status(200).json({ message: 'Cart disabled succesfully' });
        }
        await carta_1.default.findByIdAndUpdate(id, { available: true });
        return res.status(200).json({ message: 'Cart enabled succesfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.changeAvailable = changeAvailable;
const updateCart = async (req, res) => {
    try {
        const { name, price, description, category, id } = req.body;
        const cartaById = await carta_1.default.findOne({ _id: id });
        if (!cartaById || cartaById === null)
            return res.status(404).json({ message: 'Cart not found' });
        const categoryByName = await categoria_1.default.findOne({ description: category });
        if (!categoryByName || cartaById === null)
            return res.status(404).json({ message: 'Category not found' });
        const _dataCategory = (0, dataCategory_1.getDataByCategory)(categoryByName);
        if (req.file) {
            const file = req.file;
            cartaById.imgUrl = file.location;
        }
        cartaById.name = name || cartaById.name;
        cartaById.price = price || cartaById.price;
        cartaById.description = description || cartaById.description;
        cartaById.category = _dataCategory || cartaById.category;
        await cartaById.save();
        return res.status(200).json({ message: 'Cart updated succesfully', cart: cartaById });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateCart = updateCart;
