import axios from 'axios';
import { getAccessToken } from '../utils/apiClient';

const EASYECOM_WEBHOOK_BASE_URL = 'https://api.easyecom.io';

export async function createProduct(productData: any) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${EASYECOM_WEBHOOK_BASE_URL}/webhook/v2/createOrder`,
    productData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/*
{
  "orderType": "retailorder",
  "marketplaceId": 10,
  "orderNumber": "Test_ean_20221",
  "orderDate": "2024-03-19 14:32:59",
  "expDeliveryDate": "2024-03-20 11:32:59",
  "remarks1": "abc",
  "remarks2": "xyz",
  "shippingCost": 20,
  "discount": 20,
  "walletDiscount": 5,
  "promoCodeDiscount": 5,
  "prepaidDiscount": 5,
  "paymentMode": 2,
  "paymentGateway": "",
  "shippingMethod": 1,
  "is_market_shipped": 0,
  "company_carrier_id":6691,
  "packageWeight": 100,
  "packageHeight": 10,
  "packageWidth": 10,
  "packageLength": 10,
  "paymentTransactionNumber": 20202,
  "items": [
    {
      "OrderItemId": "Test_su2b_ean_2121",
      "Sku": "combo_tax_1",
      "productName": "cello",
      "Quantity": "2",
      "Price": 20,
      "itemDiscount": 1,
      "custom_fields": [
        {
          "id": 123,
          "value": "custom combo"
        }
      ]
    },
    {
      "OrderItemId": "Test_sub_ean_2022211",
      "ean": "1111",
      "productName": "cello",
      "Quantity": "2",
      "Price": 20,
      "itemDiscount": 1,
      "custom_fields": [
        {
          "id": 12322,
          "value": "custom kit"
        }
      ]
    },
    {
      "OrderItemId": "1710-20122131",
      "AccountingSku": "acc_sku_3",
      "productName": "LIT Liquid Matte Lipstick - CU46 (Blood Red Shade) | Long Lasting, Smudge-proof, Hydrating Matte Lipstick With Moringa Oil (1.6 ml)",
      "Quantity": 3,
      "Price": 66.33,
      "itemDiscount": 10,
      "custom_fields": [
        {
          "id": 847,
          "value": "default"
        }
      ]
    },
    {
      "OrderItemId": "Test_sub_ean_102221",
      "AccountingSku": "acc_sku_4",
      "productName": "cello",
      "Quantity": "2",
      "Price": 20,
      "itemDiscount": 1,
      "custom_fields": [
        {
          "id": 812447,
          "value": "custom sku"
        }
      ]
    }
  ],
  "customer": [
    {
      "gst_number":"abcdxyz132435",
      "billing": {
        "name": "test",
        "addressLine1": "testaddress1",
        "addressLine2": "testaddress2",
        "postalCode": "400067",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "contact": "9876543210",
        "email": "test@gmail.com"
      },
      "shipping": {
        "name": "test1",
        "addressLine1": "testaddress3",
        "addressLine2": "testaddress4",
        "postalCode": "400067",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "contact": "9876543210",
        "email": "test@gmail.com",
        "latitude": "12.900222",
        "longitude": "77.650914"
      }
    }
  ]
}
*/
export async function pushOrderToEasyEcom(orderData: any) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${EASYECOM_WEBHOOK_BASE_URL}/webhook/v2/createOrder`,
    orderData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getOrderDetails(invoiceId: string) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${EASYECOM_WEBHOOK_BASE_URL}/orders/V2/getOrderDetails?invoice_id=${invoiceId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function cancelOrder(invoice_id: any) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${EASYECOM_WEBHOOK_BASE_URL}/orders/cancelOrder`,
    {"invoice_id":invoice_id},
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// export async function getOrderManifest(orderId: string) {
//   const token = await getAccessToken();
//   const response = await axios.post(
//     `${EASYECOM_WEBHOOK_BASE_URL}/getOrderManifest`,
//     { orderId },
//     {
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     }
//   );
//   return response.data;
// }

// export async function getOrderTracking(orderId: string) {
//   const token = await getAccessToken();
//   const response = await axios.post(
//     `${EASYECOM_WEBHOOK_BASE_URL}/getOrderTracking`,
//     { orderId },
//     {
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     }
//   );
//   return response.data;
// }

export async function getProductMaster() {
  const token = await getAccessToken();
  const response = await axios.get(
    `${EASYECOM_WEBHOOK_BASE_URL}/Products/GetProductMaster?custom_fields=1`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  return response.data;
}


export async function getInventory(limit:any) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${EASYECOM_WEBHOOK_BASE_URL}/getInventoryDetailsV3?includeLocations=1&imit=${limit}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  return response.data;
}


// export async function getVendorMaster() {
//   const token = await getAccessToken();
//   const response = await axios.post(
//     `${EASYECOM_WEBHOOK_BASE_URL}/getVendorMaster`,
//     {},
//     {
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//     }
//   );
//   return response.data;
// }

// export async function pushVendorToEasyEcom(vendorData: any) {
//   const token = await getAccessToken();
//   const response = await axios.post(
//     `${EASYECOM_WEBHOOK_BASE_URL}/createVendor`,
//     vendorData,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// }



export async function getReturnStatus(invoice_id:any) {
  const token = await getAccessToken();
  const response = await axios.get(
    `${EASYECOM_WEBHOOK_BASE_URL}/orders/getReturnDetails?invoice_id=${invoice_id}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );
  return response.data;
}

// mark return