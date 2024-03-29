import { Router } from 'express';
import { countDetailsByCategory, detailSaleByDate, generatedReceipts, getReceiptTById, getReceipts, getSalesByDate, salePerDay, topProductSale, totalSalesByClient } from '../../controller/sales-receipts/sales-receipts.controller';

const router = Router();

router.get('/get-receipts', getReceipts)
router.get('/get-receipt/:id', getReceiptTById)
router.get('/generated-receipt', generatedReceipts)


/* REPORTES */
router.get('/find-sales', getSalesByDate)
router.get('/get-orders-to-cart', topProductSale)
router.get('/get-sales-per-day', salePerDay)
router.get('/orderDetail-to-sale-date', detailSaleByDate)
router.get('/count-orders-to-category', countDetailsByCategory)
router.get('/total-sales-by-client', totalSalesByClient)

export default router;