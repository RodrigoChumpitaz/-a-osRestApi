"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataByCategory = void 0;
const getDataByCategory = (category) => {
    return {
        id: category.id,
        name: category.description,
        slug: category.slug
    };
};
exports.getDataByCategory = getDataByCategory;
