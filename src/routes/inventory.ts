import express from 'express';
import { getInventory } from '../services/easyecomService';

const router = express.Router();

// GET /vendors - Get vendor master
router.get('/:limit', async (req, res) => {
  try {
    const { limit } = req.params;
    const result = await getInventory(limit);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /vendors - Push vendor to EasyEcom
// router.post('/', async (req, res) => {
//   try {
//     const vendorData = req.body;
//     const result = await pushVendorToEasyEcom(vendorData);
//     res.status(201).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

export default router; 