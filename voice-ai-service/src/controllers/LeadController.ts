import { Request, Response } from 'express';
import { LeadService, NewLead } from '../services';
import logger from '../config/logger';
import { z } from 'zod';

// Validation schema for creating a lead
const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  user_id: z.string().min(1, 'User ID is required'),
  source: z.string().optional().default('facebook'),
  notes: z.string().optional(),
});

export class LeadController {
  /**
   * Create a new lead
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = createLeadSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationResult.error.errors,
        });
        return;
      }
      
      const leadData = validationResult.data as NewLead;

      
      
      // Check if lead with same phone already exists
      const existingLead = await LeadService.getByPhone(leadData.phone);
      
      if (existingLead) {
        res.status(409).json({
          success: false,
          message: 'A lead with this phone number already exists',
          data: existingLead,
        });
        return;
      }
      
      // Create new lead
      const lead = await LeadService.create(leadData);
      
      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
      });

      
    } catch (error) {
      logger.error('Error creating lead', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to create lead',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get a lead by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const leadId = req.params.id;
      
      const lead = await LeadService.getById(leadId);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      logger.error('Error fetching lead', { error, leadId: req.params.id });
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lead',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * List all leads
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const { leads, count } = await LeadService.list(page, limit);
      
      res.status(200).json({
        success: true,
        data: {
          leads,
          pagination: {
            total: count,
            page,
            limit,
            pages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing leads', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to list leads',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default LeadController; 