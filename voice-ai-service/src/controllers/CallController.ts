import { Request, Response } from 'express';
import { LeadService, CallAttemptService, NewCallAttempt, CallStatus } from '../services';
import { Twilio } from 'twilio';
import { env } from '../config/environment';
import logger from '../config/logger';
import { z } from 'zod';

// Initialize Twilio client
const twilioClient = new Twilio(env.twilioAccountSid, env.twilioAuthToken);

// Validation schema for initiating a call
const initiateCallSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID format'),
});

export class CallController {
  /**
   * Initiate a call to a lead
   */
  static async initiateCall(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = initiateCallSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationResult.error.errors,
        });
        return;
      }
      
      const { leadId } = validationResult.data;
      
      // Get lead data
      const lead = await LeadService.getById(leadId);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
        return;
      }
      
      // Create a new call attempt record
      const callAttempt = await CallAttemptService.create({
        lead_id: leadId,
        status: CallStatus.PENDING,
      } as NewCallAttempt);
      
      // Update lead status to in progress
      await LeadService.update(leadId, {
        status: 'in_progress',
      });
      
      // Start the call using Twilio (this is a placeholder - actual implementation will involve TwiML)
      // In a production app, this would likely use a webhook for call initiation and status updates
      try {
        const call = await twilioClient.calls.create({
          url: `${req.protocol}://${req.get('host')}/api/calls/twiml/${callAttempt.id}`,
          to: lead.phone,
          from: env.twilioPhoneNumber,
          statusCallback: `${req.protocol}://${req.get('host')}/api/calls/status/${callAttempt.id}`,
          statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
          statusCallbackMethod: 'POST',
        });
        
        // Update call attempt with Twilio SID
        await CallAttemptService.update(callAttempt.id, {
          twilio_call_sid: call.sid,
          status: 'in_progress',
        });
        
        res.status(200).json({
          success: true,
          message: 'Call initiated successfully',
          data: {
            callAttemptId: callAttempt.id,
            twilioCallSid: call.sid,
            leadId: leadId,
          },
        });
      } catch (twilioError) {
        // Handle Twilio API errors
        logger.error('Error initiating Twilio call', { error: twilioError });
        
        // Update call attempt status to failed
        await CallAttemptService.update(callAttempt.id, {
          status: 'failed',
          notes: `Twilio error: ${twilioError instanceof Error ? twilioError.message : 'Unknown error'}`,
        });
        
        // Update lead status back to pending
        await LeadService.update(leadId, {
          status: 'pending',
        });
        
        throw twilioError;
      }
    } catch (error) {
      logger.error('Error initiating call', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to initiate call',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get a call attempt by ID
   */
  static async getCallStatus(req: Request, res: Response): Promise<void> {
    try {
      const callId = req.params.id;
      
      const callAttempt = await CallAttemptService.getById(callId);
      
      if (!callAttempt) {
        res.status(404).json({
          success: false,
          message: 'Call attempt not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: callAttempt,
      });
    } catch (error) {
      logger.error('Error fetching call status', { error, callId: req.params.id });
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch call status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * List all call attempts
   */
  static async listCalls(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const { callAttempts, count } = await CallAttemptService.list(page, limit);
      
      res.status(200).json({
        success: true,
        data: {
          calls: callAttempts,
          pagination: {
            total: count,
            page,
            limit,
            pages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing calls', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to list calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get calls for a specific lead
   */
  static async getCallsByLead(req: Request, res: Response): Promise<void> {
    try {
      const leadId = req.params.leadId;
      
      // Verify lead exists
      const lead = await LeadService.getById(leadId);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
        return;
      }
      
      const calls = await CallAttemptService.getByLeadId(leadId);
      
      res.status(200).json({
        success: true,
        data: calls,
      });
    } catch (error) {
      logger.error('Error fetching calls by lead', { error, leadId: req.params.leadId });
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch calls',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default CallController; 