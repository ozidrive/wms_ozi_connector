import axios from 'axios';
import { getPidgeAccessToken, getPidgeAccessTokenTryandbuy, getPidgeAccessTokenFC2 } from '../utils/pidgeClient';
const PIDGE_BASE_URL = 'https://api.pidge.in/';

/**
 * Detect fc_id from payload based on sender_detail address label
 * FC1: "OZI TECHNOLOGIES PRIVATE LIMITED"
 * FC2: "OZI TECHNOLOGIES PRIVATE LIMITED W2"
 */
function detectFcId(payload: any): number {
  const senderLabel = payload?.sender_detail?.address?.label || '';
  console.log(`🔍 [PIDGE SERVICE] Detecting FC ID from sender label: "${senderLabel}"`);
  
  if (senderLabel.includes('W2')) {
    console.log(`✅ [PIDGE SERVICE] FC2 detected (label contains "W2")`);
    return 2;
  }
  console.log(`✅ [PIDGE SERVICE] FC1 detected (default)`);
  return 1; // Default to FC1
}

export async function createOrder(payload: any) {
  const fcId = detectFcId(payload);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 [PIDGE SERVICE] Creating order with FC${fcId} credentials`);
  console.log(`📦 [PIDGE SERVICE] Reference ID: ${payload?.trips?.[0]?.reference_id || 'N/A'}`);
  console.log(`📦 [PIDGE SERVICE] Sender Label: ${payload?.sender_detail?.address?.label || 'N/A'}`);
  console.log(`${'='.repeat(80)}`);
  
  let token: string;
  try {
    if (fcId === 2) {
      console.log(`🔑 [PIDGE SERVICE] Using FC2 credentials for order creation`);
      token = await getPidgeAccessTokenFC2();
    } else {
      console.log(`🔑 [PIDGE SERVICE] Using FC1 credentials for order creation`);
      token = await getPidgeAccessToken();
    }
    
    console.log(`📤 [PIDGE SERVICE] Sending order to Pidge API...`);
    const response = await axios.post(
      `${PIDGE_BASE_URL}v1.0/store/channel/vendor/order`,
      payload,
      {
        headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
        timeout: 30000, // 30 seconds timeout
      }
    );
    
    console.log(`✅ [PIDGE SERVICE] Order created successfully with FC${fcId}`);
    console.log(`📥 [PIDGE SERVICE] Response status: ${response.status}`);
    console.log(`${'='.repeat(80)}\n`);
    
    return response.data;
  } catch (error: any) {
    console.error(`\n${'='.repeat(80)}`);
    console.error(`❌ [PIDGE SERVICE] Failed to create order with FC${fcId}`);
    console.error(`❌ [PIDGE SERVICE] Error: ${error.message}`);
    if (error.response) {
      console.error(`❌ [PIDGE SERVICE] Response Status: ${error.response.status}`);
      console.error(`❌ [PIDGE SERVICE] Response Data:`, JSON.stringify(error.response.data, null, 2));
    }
    console.error(`${'='.repeat(80)}\n`);
    throw error;
  }
}

export async function createOrderTryandbuy(payload: any) {
  const fcId = detectFcId(payload);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 [PIDGE SERVICE] Creating Try & Buy order with FC${fcId} credentials`);
  console.log(`📦 [PIDGE SERVICE] Reference ID: ${payload?.trips?.[0]?.reference_id || 'N/A'}`);
  console.log(`📦 [PIDGE SERVICE] Sender Label: ${payload?.sender_detail?.address?.label || 'N/A'}`);
  console.log(`${'='.repeat(80)}`);
  
  let token: string;
  try {
    if (fcId === 2) {
      console.log(`🔑 [PIDGE SERVICE] Using FC2 credentials for Try & Buy order creation`);
      token = await getPidgeAccessTokenFC2();
    } else {
      console.log(`🔑 [PIDGE SERVICE] Using TRYANDBUY credentials for Try & Buy order creation`);
      token = await getPidgeAccessTokenTryandbuy();
    }
    
    console.log(`📤 [PIDGE SERVICE] Sending Try & Buy order to Pidge API...`);
    const response = await axios.post(
      `${PIDGE_BASE_URL}v1.0/store/channel/vendor/order`,
      payload,
      {
        headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
        timeout: 30000, // 30 seconds timeout
      }
    );
    
    console.log(`✅ [PIDGE SERVICE] Try & Buy order created successfully with FC${fcId}`);
    console.log(`📥 [PIDGE SERVICE] Response status: ${response.status}`);
    console.log(`${'='.repeat(80)}\n`);
    
    return response.data;
  } catch (error: any) {
    console.error(`\n${'='.repeat(80)}`);
    console.error(`❌ [PIDGE SERVICE] Failed to create Try & Buy order with FC${fcId}`);
    console.error(`❌ [PIDGE SERVICE] Error: ${error.message}`);
    if (error.response) {
      console.error(`❌ [PIDGE SERVICE] Response Status: ${error.response.status}`);
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


export async function getRiderCurrentLocation(orderId: string, token: string) {
  const token1 = await getPidgeAccessToken();
  const response = await axios.get(`${PIDGE_BASE_URL}v1.0/store/channel/vendor/order/${orderId}/fulfillment/tracking`, {
    headers: { Authorization: `${token1}` },
  });
  return response.data;
}