import express, { Request, Response } from 'express';
import FormSubmission from '../models/FormSubmission';
import UserReviewForm from '../models/UserReviewForm';
import { API_ENDPOINTS } from '../config/constants';

const router = express.Router();

// Combined handler for /submit-form that detects form type
router.post(API_ENDPOINTS.SUBMIT_FORM, async (req: Request, res: Response) => {
  try {
    const { recommendationScore, experience, deliverySatisfaction, customerSupportSatisfaction, appExperienceSatisfaction, productQualitySatisfaction } = req.body;
    
    // Detect if this is a review form (has any review form specific fields)
    const isReviewForm = recommendationScore !== undefined || 
                         experience !== undefined || 
                         deliverySatisfaction !== undefined ||
                         customerSupportSatisfaction !== undefined ||
                         appExperienceSatisfaction !== undefined ||
                         productQualitySatisfaction !== undefined;
    
    if (isReviewForm) {
      // Handle user review form
      const { 
        name, 
        contact, 
        deliverySatisfaction, 
        customerSupportSatisfaction,
        appExperienceSatisfaction,
        productQualitySatisfaction
      } = req.body;

      // Create new user review form submission
      const userReview = await UserReviewForm.create({
        name,
        contact,
        recommendationScore,
        experience,
        deliverySatisfaction,
        customerSupportSatisfaction,
        appExperienceSatisfaction,
        productQualitySatisfaction,
        created_at: new Date()
      });

      return res.status(201).json({
        success: true,
        message: 'Review form submitted successfully',
        data: {
          id: userReview.id,
          name: userReview.name,
          contact: userReview.contact,
          recommendationScore: userReview.recommendationScore,
          createdAt: userReview.created_at
        }
      });
    } else {
      // Handle shop form (original form)
      const { name, contact, location, preferredDate, address, preferredTime, items, quantity } = req.body;

      // Validate shop form
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

      return res.status(201).json({
        success: true,
        message: 'Form submitted successfully',
        data: {
          id: formSubmission.id,
          name: formSubmission.name,
          contact: formSubmission.contact,
          createdAt: formSubmission.created_at
        }
      });
    }
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