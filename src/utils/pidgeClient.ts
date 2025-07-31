import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PIDGE_LOGIN_URL = 'https://api.pidge.in/v1.0/store/channel/vendor/login'; // Update if needed
const PIDGE_EMAIL = process.env.PIDGE_EMAIL || '';
const PIDGE_PASSWORD = process.env.PIDGE_PASSWORD || '';

let cachedToken: string | null = null;

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