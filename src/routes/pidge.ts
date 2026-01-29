import express from 'express';
import {
  // vendorLogin,
  createOrder,
  createOrderTryandbuy,
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

// Get Order Status by Order ID, Reference ID, or AWB
router.get('/order/:identifier/status', async (req, res) => {
  try {
    const { identifier } = req.params;
    console.log(`🔍 [PIDGE ROUTE] Checking order status for identifier: ${identifier}`);
    
    // Try to get order status (works with orderId, reference_id, or AWB)
    const result = await getOrderStatus(identifier, '');
    console.log(`✅ [PIDGE ROUTE] Order found: ${identifier}`);
    res.json({ success: true, data: result });
  } catch (error: any) {
    // If 404, order doesn't exist
    if (error.response?.status === 404) {
      console.log(`⚠️ [PIDGE ROUTE] Order not found: ${req.params.identifier}`);
      return res.status(404).json({ 
        success: false, 
        message: `Order not found on Pidge: ${req.params.identifier}` 
      });
    }
    console.error(`❌ [PIDGE ROUTE] Error checking order status:`, error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create Order
router.post('/order', async (req, res) => {
  try {
    const payload = req.body;
    const result = await createOrder(payload);
    res.json({ success: true, data: result });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data || { message: error.message };
    res.status(status).json({ success: false, error: message });
  }
});

// Create Order (Tryandbuy Credentials)
router.post('/order/tryandbuy', async (req, res) => {
  try {
    const payload = req.body;
    const result = await createOrderTryandbuy(payload);
    res.json({ success: true, data: result });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data || { message: error.message };
    res.status(status).json({ success: false, error: message });
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