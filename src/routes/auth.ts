import express from 'express';
import { getAccessToken } from '../utils/apiClient';

const router = express.Router();

// GET /auth/token - Get EasyEcom access token
router.get('/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ success: true, token });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; 