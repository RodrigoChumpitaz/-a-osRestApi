"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_receipts_controller_1 = require("../../controller/sales-receipts/sales-receipts.controller");
const router = (0, express_1.Router)();
router.get('/generated-receipt/:receiptId', sales_receipts_controller_1.generatedReceipts);
/* REPORTES */
router.get('/find-sales', sales_receipts_controller_1.getSalesByDate);
router.get('/get-orders-to-cart', sales_receipts_controller_1.topProductSale);
router.get('/get-sales-per-day', sales_receipts_controller_1.salePerDay);
router.get('/orderDetail-to-sale-date', sales_receipts_controller_1.detailSaleByDate);
router.get('/count-orders-to-category', sales_receipts_controller_1.countDetailsByCategory);
router.get('/total-sales-by-client', sales_receipts_controller_1.totalSalesByClient);
exports.default = router;
