import axios from 'axios';
import { getPidgeAccessToken, getPidgeAccessTokenTryandbuy, getPidgeAccessTokenFC2, getPidgeAccessTokenFC3 } from '../utils/pidgeClient';
const PIDGE_BASE_URL = 'https://api.pidge.in/';

/**
 * Generic helper to call Pidge API with retries (exponential backoff).
 * - Retries ONLY on 5xx / network errors.
 * - Does NOT retry on 4xx (payload/auth issues).
 */
async function callPidgeWithRetry<T>(
  fn: () => Promise<T>,
  context: { component: string; refId: string }
): Promise<T> {
  const maxAttempts = 3;
  const baseDelayMs = 3000; // 3s, 6s, 12s

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const attemptLabel = `${context.component} | ref=${context.refId} | attempt ${attempt}/${maxAttempts}`;
    try {
      console.log(`🚀 [PIDGE SERVICE] RETRY_CALL_START | ${attemptLabel}`);
      const result = await fn();
      console.log(`✅ [PIDGE SERVICE] RETRY_CALL_SUCCESS | ${attemptLabel}`);
      return result;
    } catch (error: any) {
      const status = error?.response?.status;
      const is4xx = status && status >= 400 && status < 500;
      const errorType =
        error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')
          ? 'Pidge_Timeout'
          : error.response
          ? status >= 500
            ? 'Pidge_5xx'
            : 'Pidge_4xx'
          : 'Pidge_Network_Error';

      console.error(
        `❌ [PIDGE SERVICE] RETRY_CALL_ERROR | ${attemptLabel}`,
        {
          component: 'PIDGE_API',
          status,
          errorType,
          message: error.message,
        }
      );

      // For 4xx or last attempt, do not retry
      if (is4xx || attempt === maxAttempts) {
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.log(
        `⏳ [PIDGE SERVICE] RETRY_CALL_BACKOFF | ${attemptLabel} | nextAttemptInMs=${delay}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Should be unreachable
  throw new Error('Unexpected retry flow termination');
}

/**
 * Sanitize receiver email in payload - always use default email for all orders
 * This ensures no invalid emails are sent to Pidge API
 */
function sanitizeReceiverEmails(payload: any): void {
  if (!payload?.trips || !Array.isArray(payload.trips)) {
    return;
  }

  payload.trips.forEach((trip: any, index: number) => {
    if (trip?.receiver_detail) {
      const originalEmail = trip.receiver_detail.email;
      // Always use default email for all orders
      trip.receiver_detail.email = 'abc@gmail.com';
      
      if (originalEmail && originalEmail !== 'abc@gmail.com') {
        console.log(`📧 [PIDGE SERVICE] Sanitized email in trip[${index}]: "${originalEmail}" → "abc@gmail.com"`);
      }
    }
  });
}

/**
 * Detect fc_id from payload based on sender_detail or receiver_detail address label
 * FC1: "OZI TECHNOLOGIES PRIVATE LIMITED"
 * FC2: "OZI TECHNOLOGIES PRIVATE LIMITED W2"
 * FC3: "OZI TECHNOLOGIES PRIVATE LIMITED W3"
 *
 * For regular orders: FC address is in sender_detail (FC → customer)
 * For return orders:  FC address is in receiver_detail (customer → FC)
 */
function detectFcId(payload: any): number {
  const senderLabel = payload?.sender_detail?.address?.label || '';
  const receiverLabel = payload?.trips?.[0]?.receiver_detail?.address?.label || '';

  console.log(`🔍 [PIDGE SERVICE] Detecting FC ID from sender label: "${senderLabel}", receiver label: "${receiverLabel}"`);

  // Check sender_detail first (regular orders: FC is sender)
  if (senderLabel.includes('W3')) {
    console.log(`✅ [PIDGE SERVICE] FC3 detected from sender label (contains "W3")`);
    return 3;
  }
  if (senderLabel.includes('W2')) {
    console.log(`✅ [PIDGE SERVICE] FC2 detected from sender label (contains "W2")`);
    return 2;
  }

  // Check receiver_detail (return orders: FC is receiver)
  if (receiverLabel.includes('W3')) {
    console.log(`✅ [PIDGE SERVICE] FC3 detected from receiver label (return order, contains "W3")`);
    return 3;
  }
  if (receiverLabel.includes('W2')) {
    console.log(`✅ [PIDGE SERVICE] FC2 detected from receiver label (return order, contains "W2")`);
    return 2;
  }

  console.log(`✅ [PIDGE SERVICE] FC1 detected (default)`);
  return 1; // Default to FC1
}

export async function createOrder(payload: any) {
  // Sanitize receiver emails before processing
  sanitizeReceiverEmails(payload);
  
  const fcId = detectFcId(payload);
  const refId = payload?.trips?.[0]?.reference_id || 'N/A';
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 [PIDGE SERVICE] Creating order with FC${fcId} credentials`);
  console.log(`📦 [PIDGE SERVICE] Reference ID: ${refId}`);
  console.log(`📦 [PIDGE SERVICE] Sender Label: ${payload?.sender_detail?.address?.label || 'N/A'}`);
  console.log(`${'='.repeat(80)}`);
  
  let token: string;
  try {
    if (fcId === 3) {
      console.log(`🔑 [PIDGE SERVICE] Using FC3 credentials for order creation`);
      token = await getPidgeAccessTokenFC3();
    } else if (fcId === 2) {
      console.log(`🔑 [PIDGE SERVICE] Using FC2 credentials for order creation`);
      token = await getPidgeAccessTokenFC2();
    } else {
      console.log(`🔑 [PIDGE SERVICE] Using FC1 credentials for order creation`);
      token = await getPidgeAccessToken();
    }
    console.log(`📤 [PIDGE SERVICE] Sending order to Pidge API...`);

    const response = await callPidgeWithRetry(
      () =>
        axios.post(
          `${PIDGE_BASE_URL}v1.0/store/channel/vendor/order`,
          payload,
          {
            headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
            timeout: 30000, // 30 seconds timeout
          }
        ),
      { component: 'WMS_OZI_CONNECTOR', refId }
    );
    
    console.log(`✅ [PIDGE SERVICE] Order created successfully with FC${fcId}`);
    console.log(`📥 [PIDGE SERVICE] Response status: ${response.status}`);
    console.log(`${'='.repeat(80)}\n`);
    
    return response.data;
  } catch (error: any) {
    console.error(`\n${'='.repeat(80)}`);
    const status = error?.response?.status;
    const errorType =
      error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')
        ? 'Pidge_Timeout'
        : error.response
        ? status >= 500
          ? 'Pidge_5xx'
          : 'Pidge_4xx'
        : 'Pidge_Network_Error';

    console.error(`❌ [PIDGE SERVICE] Failed to create order with FC${fcId}`);
    console.error(
      `❌ [PIDGE SERVICE] Error Summary:`,
      {
        component: 'PIDGE_API',
        status,
        errorType,
        refId,
        message: error.message,
      }
    );
    if (error.response) {
      console.error(`❌ [PIDGE SERVICE] Response Status: ${status}`);
      console.error(`❌ [PIDGE SERVICE] Response Data:`, JSON.stringify(error.response.data, null, 2));
    }
    console.error(`${'='.repeat(80)}\n`);
    throw error;
  }
}

export async function createOrderTryandbuy(payload: any) {
  // Sanitize receiver emails before processing
  sanitizeReceiverEmails(payload);
  
  const fcId = detectFcId(payload);
  const refId = payload?.trips?.[0]?.reference_id || 'N/A';
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 [PIDGE SERVICE] Creating Try & Buy order with FC${fcId} credentials`);
  console.log(`📦 [PIDGE SERVICE] Reference ID: ${refId}`);
  console.log(`📦 [PIDGE SERVICE] Sender Label: ${payload?.sender_detail?.address?.label || 'N/A'}`);
  console.log(`${'='.repeat(80)}`);
  
  let token: string;
  try {
    if (fcId === 3) {
      console.log(`🔑 [PIDGE SERVICE] Using FC3 credentials for Try & Buy order creation`);
      token = await getPidgeAccessTokenFC3();
    } else if (fcId === 2) {
      console.log(`🔑 [PIDGE SERVICE] Using FC2 credentials for Try & Buy order creation`);
      token = await getPidgeAccessTokenFC2();
    } else {
      console.log(`🔑 [PIDGE SERVICE] Using TRYANDBUY credentials for Try & Buy order creation`);
      token = await getPidgeAccessTokenTryandbuy();
    }
    console.log(`📤 [PIDGE SERVICE] Sending Try & Buy order to Pidge API...`);

    const response = await callPidgeWithRetry(
      () =>
        axios.post(
          `${PIDGE_BASE_URL}v1.0/store/channel/vendor/order`,
          payload,
          {
            headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
            timeout: 30000, // 30 seconds timeout
          }
        ),
      { component: 'WMS_OZI_CONNECTOR', refId }
    );
    
    console.log(`✅ [PIDGE SERVICE] Try & Buy order created successfully with FC${fcId}`);
    console.log(`📥 [PIDGE SERVICE] Response status: ${response.status}`);
    console.log(`${'='.repeat(80)}\n`);
    
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const errorType =
      error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')
        ? 'Pidge_Timeout'
        : error.response
        ? status >= 500
          ? 'Pidge_5xx'
          : 'Pidge_4xx'
        : 'Pidge_Network_Error';

    console.error(`\n${'='.repeat(80)}`);
    console.error(`❌ [PIDGE SERVICE] Failed to create Try & Buy order with FC${fcId}`);
    console.error(
      `❌ [PIDGE SERVICE] Error Summary:`,
      {
        component: 'PIDGE_API',
        status,
        errorType,
        refId,
        message: error.message,
      }
    );
    if (error.response) {
      console.error(`❌ [PIDGE SERVICE] Response Status: ${status}`);
      console.error(`❌ [PIDGE SERVICE] Response Data:`, JSON.stringify(error.response.data, null, 2));
    }
    console.error(`${'='.repeat(80)}\n`);
    throw error;
  }
}

export async function getOrderStatus(orderId: string, token: string) {
  const token1 = await getPidgeAccessToken();
  console.log('Using token:', token1); // Debugging line to check token
  const response = await axios.get(`${PIDGE_BASE_URL}v1.0/store/channel/vendor/order/${orderId}`, {
    headers: { Authorization: `${token1}` },
  });
  return response.data;
}


export async function getRiderCurrentLocation(orderId: string, storeId: string) {
  // Determine FC based on storeId
  // storeId: 11 -> FC1, storeId: 17 -> FC2, default -> FC3
  let fcId: number;
  if (storeId === '11') {
    fcId = 1;
  } else if (storeId === '17') {
    fcId = 2;
  } else {
    fcId = 3; // Default to FC3 if no storeId matching
  }
  console.log(`🔍 [PIDGE SERVICE] Getting rider location for order ${orderId} with FC${fcId} (storeId: ${storeId})`);
  
  let token: string;
  try {
    if (fcId === 3) {
      console.log(`🔑 [PIDGE SERVICE] Using FC3 credentials for rider location`);
      token = await getPidgeAccessTokenFC3();
    } else if (fcId === 2) {
      console.log(`🔑 [PIDGE SERVICE] Using FC2 credentials for rider location`);
      token = await getPidgeAccessTokenFC2();
    } else {
      console.log(`🔑 [PIDGE SERVICE] Using FC1 credentials for rider location`);
      token = await getPidgeAccessToken();
    }
    
    const response = await axios.get(`${PIDGE_BASE_URL}v1.0/store/channel/vendor/order/${orderId}/fulfillment/tracking`, {
      headers: { Authorization: `${token}` },
    });
    console.log(`✅ [PIDGE SERVICE] Rider location retrieved successfully for order ${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ [PIDGE SERVICE] Failed to get rider location for order ${orderId}:`, error.message);
    throw error;
  }
}