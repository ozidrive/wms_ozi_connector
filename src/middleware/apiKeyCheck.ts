import { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  // Skip API key validation for form submission route
  if (req.path === '/submit-form') {
    return next();
  }
  
  const apiKey = req.headers['api-key']||'';
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  
  next();
};