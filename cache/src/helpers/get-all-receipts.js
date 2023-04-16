"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptsLenght = void 0;
const receipt_1 = __importDefault(require("../model/receipt"));
const getReceiptsLenght = async () => {
    const receipts = await receipt_1.default.find();
    return receipts.length;
};
exports.getReceiptsLenght = getReceiptsLenght;
