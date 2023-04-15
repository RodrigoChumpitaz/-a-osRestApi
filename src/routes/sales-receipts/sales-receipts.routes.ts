import { Router } from 'express';
import { countDetailsByCategory, detailSaleByDate, generatedReceipts, getSalesByDate, salePerDay, topProductSale, totalSalesByClient } from '../../controller/sales-receipts/sales-receipts.controller';

const router = Router();

router.get('/generated-receipt/:receiptId', generatedReceipts)

/* REPORTES */
router.get('/find-sales', getSalesByDate)
router.get('/get-orders-to-cart', topProductSale)
router.get('/get-sales-per-day', salePerDay)
router.get('/orderDetail-to-sale-date', detailSaleByDate)
router.get('/count-orders-to-category', countDetailsByCategory)
router.get('/total-sales-by-client', totalSalesByClient)

export default router;