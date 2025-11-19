import express, { Request, Response } from 'express';
import { forwardWebhook } from '../services/webhookService';
import { API_ENDPOINTS } from '../config/constants';

const router = express.Router();

/**
 * POST /webhook
 * Receives webhook data from Pidge and forwards it to 2 configured endpoints
 */
router.post(API_ENDPOINTS.WEBHOOK, async (req: Request, res: Response) => {
  try {
    // Capture the received webhook data from Pidge
    const webhookData = req.body;
    
    // Log the received webhook from Pidge (optional, for debugging)
    console.log('Received webhook from Pidge:', JSON.stringify(webhookData, null, 2));
    
    // Forward the same data to all configured endpoints
    const forwardResult = await forwardWebhook(webhookData);
    
    // Determine overall success - at least one must succeed
    const overallSuccess = forwardResult.successful > 0;
    const statusCode = overallSuccess ? 200 : 500;
    
    // Return response with both received and forwarded status
    res.status(statusCode).json({
      success: overallSuccess,
      message: overallSuccess 
        ? `Webhook received and forwarded to ${forwardResult.successful} of ${forwardResult.total} endpoints`
        : `Webhook received but failed to forward to all ${forwardResult.total} endpoints`,
      received: {
        timestamp: new Date().toISOString(),
        data: webhookData
      },
      forwarded: forwardResult
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    
    // Determine status code based on error
    const statusCode = error.status || 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error processing webhook',
      received: {
        timestamp: new Date().toISOString(),
        data: req.body
      },
      error: {
        status: error.status || null,
        message: error.error || error.message,
        originalError: error.originalError || null
      }
    });
  }
});

export default router;

