import { Request, Response } from 'express';
import { LeadService, CallAttemptService, AppointmentService, NewAppointment } from '../services';
import logger from '../config/logger';
import { z } from 'zod';

// Validation schema for creating an appointment
const createAppointmentSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID format'),
  callAttemptId: z.string().uuid('Invalid call attempt ID format'),
  scheduledTime: z.string().refine(str => !isNaN(Date.parse(str)), { message: 'Invalid date format. Use ISO format with timezone' }),
  duration: z.number().int().positive().default(60),
  notes: z.string().optional(),
});

export class AppointmentController {
  /**
   * Create a new appointment
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = createAppointmentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationResult.error.errors,
        });
        return;
      }
      
      const appointmentData = validationResult.data;
      
      // Verify lead exists
      const lead = await LeadService.getById(appointmentData.leadId);
      
      if (!lead) {
        res.status(404).json({
          success: false,
          message: 'Lead not found',
        });
        return;
      }
      
      // Verify call attempt exists
      const callAttempt = await CallAttemptService.getById(appointmentData.callAttemptId);
      
      if (!callAttempt) {
        res.status(404).json({
          success: false,
          message: 'Call attempt not found',
        });
        return;
      }
      
      // Create appointment
      const appointment = await AppointmentService.create({
        lead_id: appointmentData.leadId,
        call_attempt_id: appointmentData.callAttemptId,
        scheduled_time: appointmentData.scheduledTime,
        duration: appointmentData.duration,
        notes: appointmentData.notes,
      } as NewAppointment);
      
      // Update lead status
      await LeadService.update(appointmentData.leadId, {
        status: 'appointment_set',
      });
      
      // Update call attempt result
      await CallAttemptService.update(appointmentData.callAttemptId, {
        result: 'appointment_set',
      });
      
      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment,
      });
    } catch (error) {
      logger.error('Error creating appointment', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to create appointment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get an appointment by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.id;
      
      const appointment = await AppointmentService.getById(appointmentId);
      
      if (!appointment) {
        res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      logger.error('Error fetching appointment', { error, appointmentId: req.params.id });
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update an appointment
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const appointmentId = req.params.id;
      
      // Verify appointment exists
      const appointment = await AppointmentService.getById(appointmentId);
      
      if (!appointment) {
        res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
        return;
      }
      
      // Validate request body (partial update)
      const updateSchema = createAppointmentSchema.partial();
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationResult.error.errors,
        });
        return;
      }
      
      const updateData = validationResult.data;
      
      // Update appointment
      const updatedAppointment = await AppointmentService.update(appointmentId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: updatedAppointment,
      });
    } catch (error) {
      logger.error('Error updating appointment', { error, appointmentId: req.params.id });
      
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * List all appointments
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const { appointments, count } = await AppointmentService.list(page, limit);
      
      res.status(200).json({
        success: true,
        data: {
          appointments,
          pagination: {
            total: count,
            page,
            limit,
            pages: Math.ceil(count / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing appointments', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to list appointments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get upcoming appointments
   */
  static async getUpcoming(req: Request, res: Response): Promise<void> {
    try {
      const appointments = await AppointmentService.getUpcoming();
      
      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      logger.error('Error fetching upcoming appointments', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming appointments',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default AppointmentController; 