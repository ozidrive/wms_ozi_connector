import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN_URL = 'https://api.easyecom.io/access/token';
const EMAIL = process.env.EASYECOM_EMAIL || '';
const PASSWORD = process.env.EASYECOM_PASSWORD || '';
const LOCATION_KEY = process.env.EASYECOM_LOCATION_KEY || '';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }
  const response = await axios.post(TOKEN_URL, {
    email: EMAIL,
    password: PASSWORD,
    location_key: LOCATION_KEY,
  });
  console.log("23",response.data.data.token);
  const { jwt_token, expires_in } = response.data.data.token;
  cachedToken = jwt_token;
  tokenExpiry = now + (expires_in - 60) * 1000; // Refresh 1 min before expiry
  return cachedToken || '';
} 