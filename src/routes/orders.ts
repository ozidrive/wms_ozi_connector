import express from 'express';
import {
  pushOrderToEasyEcom,
  getOrderDetails,
  cancelOrder
} from '../services/easyecomService';

const router = express.Router();

// POST /orders - Push order to EasyEcom
router.post('/createOrder', async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const orderData = req.body;
    const result = await pushOrderToEasyEcom(orderData);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error pushing order to EasyEcom:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /orders/:orderNumber - Get order details
router.get('/getOrder/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const result = await getOrderDetails(invoiceId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('cancelOrder/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const result = await cancelOrder(invoiceId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /orders/:orderNumber/manifest - Get order manifest
// router.get('/:orderNumber/manifest', async (req, res) => {
//   try {
//     const { orderNumber } = req.params;
//     const result = await getOrderManifest(orderNumber);
//     res.json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// GET /orders/:orderNumber/tracking - Get order tracking
// router.get('/:orderNumber/tracking', async (req, res) => {
//   try {
//     const { orderNumber } = req.params;
//     const result = await getOrderTracking(orderNumber);
//     res.json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// POST /orders/:orderNumber/return - Create a return order
// router.post('/:orderNumber/return', async (req, res) => {
//   try {
//     const { orderNumber } = req.params;
//     const returnData = req.body;
//     const result = await createReturnOrder(orderNumber, returnData);
//     res.status(201).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });




export default router; 