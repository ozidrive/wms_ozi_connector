import axios, { AxiosError } from 'axios';
import { WEBHOOK_CONFIG } from '../config/constants';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Forwards webhook data to a single endpoint
 * @param url - The URL to forward to
 * @param data - The webhook payload data
 * @returns Promise with the response from the forwarded endpoint
 */
async function forwardToSingleUrl(url: string, data: any): Promise<any> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Add PIDGE_API_TOKEN if configured
    const pidgeToken = process.env.PIDGE_API_TOKEN;
    if (pidgeToken) {
      headers['Authorization'] = `Bearer ${pidgeToken}`;
      console.log(`🔑 [WEBHOOK SERVICE] Adding PIDGE_API_TOKEN to webhook forward headers`);
    } else {
      console.warn(`⚠️ [WEBHOOK SERVICE] PIDGE_API_TOKEN not configured, forwarding without auth token`);
    }
    
    const response = await axios.post(url, data, {
      headers,
      timeout: 30000 // 30 seconds timeout
    });

    return {
      success: true,
      url,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        url,
        status: axiosError.response.status,
        message: 'Failed to forward webhook',
        error: axiosError.response.data,
        originalError: axiosError.message
      };
    } else if (axiosError.request) {
      // The request was made but no response was received
      return {
        success: false,
        url,
        status: null,
        message: 'No response received from webhook forwarding endpoint',
        error: 'Network error or timeout',
        originalError: axiosError.message
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        url,
        status: null,
        message: 'Error setting up webhook forward request',
        error: axiosError.message,
        originalError: axiosError.message
      };
    }
  }
}

/**
 * Forwards webhook data to all configured endpoints
 * @param data - The webhook payload data
 * @param forwardUrls - Optional array of URLs to forward to. If not provided, uses WEBHOOK_CONFIG.FORWARD_URLS
 * @returns Promise with the results from all forwarded endpoints
 */
export async function forwardWebhook(data: any, forwardUrls?: string[]): Promise<any> {
  const urlsToUse = forwardUrls || WEBHOOK_CONFIG.FORWARD_URLS;
  
  if (!urlsToUse || urlsToUse.length === 0) {
    const envVarName = forwardUrls ? 'custom URLs' : 'WEBHOOK_FORWARD_URLS';
    throw new Error(`Webhook forward URLs are not configured. Please set ${envVarName} environment variable (comma-separated).`);
  }

  // Forward to all URLs in parallel
  const forwardPromises = urlsToUse.map(url => forwardToSingleUrl(url, data));
  const results = await Promise.allSettled(forwardPromises);

  // Transform results to a consistent format
  const forwardedResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        url: urlsToUse[index],
        status: null,
        message: 'Error forwarding webhook',
        error: result.reason?.message || 'Unknown error',
        originalError: result.reason?.message || 'Unknown error'
      };
    }
  });

  // Return summary with individual results
  const successCount = forwardedResults.filter(r => r.success).length;
  const totalCount = forwardedResults.length;

  return {
    total: totalCount,
    successful: successCount,
    failed: totalCount - successCount,
    results: forwardedResults
  };
}

