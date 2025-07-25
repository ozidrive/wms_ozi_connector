import express from 'express';
import { getReturnStatus } from '../services/easyecomService';

const router = express.Router();

// POST /returns - Create a return order
router.get('/getReturnStatus/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: 'invoice_id is required' });
    }
    const result = await getReturnStatus(invoiceId);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; 