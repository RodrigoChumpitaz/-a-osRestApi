import { Router } from 'express';
import { generatedReceipts } from '../../controller/sales-receipts/sales-receipts.controller';

const router = Router();

router.get('/generated-receipt/:receiptId', generatedReceipts)

export default router;