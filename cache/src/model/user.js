"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const create_strings_1 = require("../helpers/create-strings");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    documentType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'DocumentType',
        required: true
    },
    documentNumber: { type: String, required: true, unique: true },
    email: {
        type: String, required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { type: String, required: true },
    address: { type: String, required: false, default: 'Perú' },
    token: { type: String, default: (0, create_strings_1.generarId)() },
    confirmed: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    slug: { type: String },
    carrito: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Carta'
        }],
    roles: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Rol',
            required: true
        }]
}, {
    timestamps: true,
    versionKey: false
});
userSchema.pre('save', async function (next) {
    if (!this.slug) {
        this.slug = (0, create_strings_1.getSlug)();
    }
    const user = this;
    if (!user.isModified('password'))
        return next();
    const salt = await bcrypt_1.default.genSalt(10);
    const hash = await bcrypt_1.default.hash(user.password, salt);
    user.password = hash;
    next();
});
userSchema.methods.generatedSlug = function () {
    return (0, create_strings_1.getSlug)();
};
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
exports.default = (0, mongoose_1.model)('User', userSchema);
