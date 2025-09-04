import axios from 'axios';
// import { getPidgeAccessToken } from '../utils/pidgeClient';
import { getPidgeAccessToken, getPidgeAccessTokenTryandbuy } from '../utils/pidgeClient'; // Ensure this path is correct
const PIDGE_BASE_URL = 'https://api.pidge.in/'; // Replace with actual base URL if different



export async function createOrder(payload: any) {
  const token = await getPidgeAccessToken();
  const response = await axios.post(
    `${PIDGE_BASE_URL}v1.0/store/channel/vendor/order`,
    payload,
    {
      headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
    }
  );
  return response.data;
}

export async function createOrderTryandbuy(payload: any) {
  const token = await getPidgeAccessTokenTryandbuy();
  const response = await axios.post(
    `${PIDGE_BASE_URL}v1.0/store/channel/vendor/order`,
    payload,
    {
      headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
    }
  );
  return response.data;
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