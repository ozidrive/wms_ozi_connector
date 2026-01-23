import express, { Request, Response } from 'express';
import { forwardWebhook } from '../services/webhookService';
import { API_ENDPOINTS, WEBHOOK_CONFIG } from '../config/constants';

const router = express.Router();

/**
 * POST /webhook
 * Receives webhook data from Pidge and forwards it to configured endpoints
 * Uses NODE_WEBHOOK_FORWARD_URLS if:
 *   - reference_id has format PREFIX_orderId_orderStoreId (e.g., TNB_10090_12)
 *   - reference_id includes -PD (e.g., S_TNB_2002919-PD)
 * Uses WEBHOOK_FORWARD_URLS if reference_id has format PREFIX_orderId (e.g., OTP_214571)
 */
router.post(API_ENDPOINTS.WEBHOOK, async (req: Request, res: Response) => {
  try {
    // Capture the received webhook data from Pidge
    const webhookData = req.body;
    
    // Log the received webhook from Pidge (optional, for debugging)
    console.log('Received webhook from Pidge:', JSON.stringify(webhookData, null, 2));
    
    // Determine which forward URLs to use based on reference_id format
    let forwardUrls = WEBHOOK_CONFIG.FORWARD_URLS;
    const referenceId = webhookData.reference_id;
    
    if (referenceId) {
      // Parse reference_id format: TNB_10090_12 or OTP_10090_12 or S_TNB_10090_12 or S_OTP_10090_12
      // where 10090 is order_id and 12 is order_store_id
      // If it has 2 underscores after removing prefix, use NODE_WEBHOOK_FORWARD_URLS
      // Also use NODE_WEBHOOK_FORWARD_URLS if reference_id includes -PD (e.g., S_TNB_2002919-PD)
      const withoutPrefix = referenceId.replace(/^(TNB_|OTP_|S_TNB_|S_OTP_)/, '');
      const parts = withoutPrefix.split('_');
      
      // Check if reference_id includes -PD or has format PREFIX_orderId_orderStoreId (2 parts after removing prefix)
      if (referenceId.includes('-PD') || parts.length >= 2) {
        forwardUrls = WEBHOOK_CONFIG.NODE_FORWARD_URLS;
        console.log(`Using NODE_WEBHOOK_FORWARD_URLS for reference_id: ${referenceId}`);
      } else {
        console.log(`Using WEBHOOK_FORWARD_URLS for reference_id: ${referenceId}`);
      }
    }
    
    // Forward the same data to all configured endpoints
    const forwardResult = await forwardWebhook(webhookData, forwardUrls);
    
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

