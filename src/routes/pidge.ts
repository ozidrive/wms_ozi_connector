import express from 'express';
import {
  // vendorLogin,
  getOrderStatus,
  getRiderCurrentLocation,
} from '../services/pidgeService';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// // Vendor Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const result = await vendorLogin(email, password);
//     res.json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// Get Order Status
router.get('/order/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const token = process.env.PIDGE_API_TOKEN || '';
    const result = await getOrderStatus(orderId, token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Webhook Status Update (Pidge will POST here)
router.post('/webhook/status', (req, res) => {
  // Handle webhook payload in req.body
  // You may want to log or process the update
  console.log('Received webhook:', req.body);
  res.status(200).json({ success: true });
});

// Get Rider Current Location
router.get('/rider/:riderId/location', async (req, res) => {
  try {
    const { riderId } = req.params;
    // const token = req.headers['authorization']?.replace('Bearer ', '') || '';
    const token = process.env.PIDGE_API_TOKEN || '';
    const result = await getRiderCurrentLocation(riderId, token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;