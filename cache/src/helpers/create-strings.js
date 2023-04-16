"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlug = exports.generarId = void 0;
const generarId = () => {
    return Math.random().toString(32).substring(2) + Date.now().toString(32);
};
exports.generarId = generarId;
const getSlug = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 10; i++) {
        slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return slug;
};
exports.getSlug = getSlug;
