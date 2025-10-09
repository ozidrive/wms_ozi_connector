import express, { Request, Response, NextFunction } from 'express';
import FormSubmission from '../models/FormSubmission';
import { API_ENDPOINTS } from '../config/constants';

const router = express.Router();

// Validate form data
const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const { name, contact, location, preferredDate, address, preferredTime, items, quantity } = req.body;
  
  if (!name || !contact) {
    return res.status(400).json({
      success: false,
      message: 'Name and contact are required fields'
    });
  }

  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({
      success: false,
      message: 'Valid location with lat and lng is required'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one item is required'
    });
  }

  next();
};

router.post(API_ENDPOINTS.SUBMIT_FORM, validateFormData, async (req: Request, res: Response) => {
  try {
    const { name, contact, location, preferredDate, address, preferredTime, items, quantity } = req.body;

    // Create new form submission
    const formSubmission = await FormSubmission.create({
      name,
      contact,
      location,
      preferredDate,
      address,
      preferredTime,
      items,
      quantity,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: formSubmission.id,
        name: formSubmission.name,
        contact: formSubmission.contact,
        createdAt: formSubmission.created_at
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
    });
  }
});

export default router;