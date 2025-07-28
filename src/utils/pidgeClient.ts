import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PIDGE_LOGIN_URL = 'https://api.pidge.in/v1.0/store/channel/vendor/login'; // Update if needed
const PIDGE_EMAIL = process.env.PIDGE_EMAIL || '';
const PIDGE_PASSWORD = process.env.PIDGE_PASSWORD || '';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getPidgeAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }
  const response = await axios.post(PIDGE_LOGIN_URL, {
    email: PIDGE_EMAIL,
    password: PIDGE_PASSWORD,
  });
  // Adjust the following lines based on actual API response structure
  const { token, expires_in } = response.data.data; // Check API docs for correct keys
  cachedToken = token;
  tokenExpiry = now + (expires_in - 60) * 1000; // Refresh 1 min before expiry
  return cachedToken || '';
}