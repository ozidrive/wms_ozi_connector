import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PIDGE_LOGIN_URL = 'https://api.pidge.in/v1.0/store/channel/vendor/login';
const PIDGE_EMAIL = process.env.PIDGE_EMAIL || '';
const PIDGE_PASSWORD = process.env.PIDGE_PASSWORD || '';
const PIDGE_EMAIL_TRYANDBUY = process.env.PIDGE_EMAIL_TRYANDBUY || '';
const PIDGE_PASSWORD_TRYANDBUY = process.env.PIDGE_PASSWORD_TRYANDBUY || '';

// FC2 credentials (for fc_id = 2 orders)
const PIDGE_EMAIL_FC2 = process.env.PIDGE_EMAIL_FC2 || '';
const PIDGE_PASSWORD_FC2 = process.env.PIDGE_PASSWORD_FC2 || '';

let cachedToken: string | null = null;
let cachedTokenTryandbuy: string | null = null;
let cachedTokenFC2: string | null = null;

export async function getPidgeAccessToken(): Promise<string> {
  console.log('🔑 [PIDGE CLIENT] Fetching Pidge access token (FC1)...');
  try {
    const response = await axios.post(PIDGE_LOGIN_URL, {
      username: PIDGE_EMAIL,
      password: PIDGE_PASSWORD,
    });
    const { token } = response.data.data;
    console.log('✅ [PIDGE CLIENT] FC1 token received successfully');
    cachedToken = token;
    return cachedToken || '';
  } catch (error: any) {
    console.error('❌ [PIDGE CLIENT] Failed to fetch FC1 token:', error.message);
    throw error;
  }
}

export async function getPidgeAccessTokenTryandbuy(): Promise<string> {
  console.log('🔑 [PIDGE CLIENT] Fetching Pidge access token (TRYANDBUY)...');
  try {
    const response = await axios.post(PIDGE_LOGIN_URL, {
      username: PIDGE_EMAIL_TRYANDBUY,
      password: PIDGE_PASSWORD_TRYANDBUY,
    });
    const { token } = response.data.data;
    console.log('✅ [PIDGE CLIENT] TRYANDBUY token received successfully');
    cachedTokenTryandbuy = token;
    return cachedTokenTryandbuy || '';
  } catch (error: any) {
    console.error('❌ [PIDGE CLIENT] Failed to fetch TRYANDBUY token:', error.message);
    throw error;
  }
}

export async function getPidgeAccessTokenFC2(): Promise<string> {
  console.log('🔑 [PIDGE CLIENT] Fetching Pidge access token (FC2)...');
  console.log(`🔍 [PIDGE CLIENT] FC2 Username: ${PIDGE_EMAIL_FC2}`);
  try {
    const response = await axios.post(PIDGE_LOGIN_URL, {
      username: PIDGE_EMAIL_FC2,
      password: PIDGE_PASSWORD_FC2,
    });
    const { token } = response.data.data;
    console.log('✅ [PIDGE CLIENT] FC2 token received successfully');
    cachedTokenFC2 = token;
    return cachedTokenFC2 || '';
  } catch (error: any) {
    console.error('❌ [PIDGE CLIENT] Failed to fetch FC2 token:', error.message);
    if (error.response) {
      console.error('❌ [PIDGE CLIENT] FC2 Error Response:', JSON.stringify(error.response.data, null, 2));
      console.error('❌ [PIDGE CLIENT] FC2 Status:', error.response.status);
    }
    throw error;
  }
}