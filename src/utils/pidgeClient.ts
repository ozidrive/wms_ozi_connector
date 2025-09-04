import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PIDGE_LOGIN_URL = 'https://api.pidge.in/v1.0/store/channel/vendor/login'; // Update if needed
const PIDGE_EMAIL = process.env.PIDGE_EMAIL || '';
const PIDGE_PASSWORD = process.env.PIDGE_PASSWORD || '';
const PIDGE_EMAIL_TRYANDBUY = process.env.PIDGE_EMAIL_TRYANDBUY || '';
const PIDGE_PASSWORD_TRYANDBUY = process.env.PIDGE_PASSWORD_TRYANDBUY || '';

let cachedToken: string | null = null;
let cachedTokenTryandbuy: string | null = null;

export async function getPidgeAccessToken(): Promise<string> {
  console.log('Fetching Pidge access token...');
  const response = await axios.post(PIDGE_LOGIN_URL, {
    username: PIDGE_EMAIL,
    password: PIDGE_PASSWORD,
  });
  // Adjust the following lines based on actual API response structure
  const { token } = response.data.data; // Check API docs for correct keys
  console.log('Received data:', response.data);
  cachedToken = token;
  console.log('Pidge access token fetched successfully:', cachedToken);
  return cachedToken || '';
}

export async function getPidgeAccessTokenTryandbuy(): Promise<string> {
  console.log('Fetching Pidge access token (TRYANDBUY)...');
  const response = await axios.post(PIDGE_LOGIN_URL, {
    username: PIDGE_EMAIL_TRYANDBUY,
    password: PIDGE_PASSWORD_TRYANDBUY,
  });
  // Adjust the following lines based on actual API response structure
  const { token } = response.data.data; // Check API docs for correct keys
  console.log('Received data (TRYANDBUY):', response.data);
  cachedTokenTryandbuy = token;
  console.log('Pidge access token (TRYANDBUY) fetched successfully:', cachedTokenTryandbuy);
  return cachedTokenTryandbuy || '';
}