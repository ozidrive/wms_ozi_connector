import express from 'express';
import { getProductMaster, createProduct } from '../services/easyecomService';

const router = express.Router();

// GET /products - Get product master
router.get('/getAllProducts', async (req, res) => {
  try {
    const result = await getProductMaster();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/createProduct', async (req, res) => {
  try {
    const productData = req.body;
    const result = await createProduct(productData);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; 