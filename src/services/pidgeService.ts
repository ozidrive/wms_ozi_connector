import axios from 'axios';
// import { getPidgeAccessToken } from '../utils/pidgeClient';

const PIDGE_BASE_URL = 'https://api.pidge.in'; // Replace with actual base URL if different



export async function getOrderStatus(orderId: string, token: string) {
  const response = await axios.get(`${PIDGE_BASE_URL}v1.0/store/channel/vendor/order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}


export async function getRiderCurrentLocation(orderId: string, token: string) {
  const response = await axios.get(`${PIDGE_BASE_URL}/v1.0/store/channel/vendor/order/${orderId}/fulfillment/tracking`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}