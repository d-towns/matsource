import { Twilio } from 'twilio';
import { env } from '../config/environment';
import logger from '../config/logger';
import { AppointmentService, LeadService, OpenAIService } from './';
import { Appointment } from './AppointmentService';
import OpenAI from 'openai';

// Initialize Twilio client
const twilioClient = new Twilio(env.twilioAccountSid, env.twilioAuthToken);

// Initialize OpenAI client directly for this service
const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

/**
 * Service for sending appointment reminders
 */
export class ReminderService {
  /**
   * Process and send appointment reminders for upcoming appointments
   */
  static async processReminders(): Promise<void> {
    try {
      // Get all appointments that need reminders
      const appointmentsNeedingReminders = await AppointmentService.getNeedingReminders();
      
      logger.info('Processing reminders', { 
        count: appointmentsNeedingReminders.length 
      });
      
      // Process each appointment
      for (const appointment of appointmentsNeedingReminders) {
        await ReminderService.sendReminder(appointment);
      }
    } catch (error) {
      logger.error('Error processing reminders', { error });
    }
  }
  
  /**
   * Send a reminder for a specific appointment
   */
  static async sendReminder(appointment: Appointment): Promise<void> {
    try {
      // Get lead details
      const lead = await LeadService.getById(appointment.lead_id);
      
      if (!lead) {
        logger.error('Lead not found for appointment reminder', { 
          appointmentId: appointment.id, 
          leadId: appointment.lead_id 
        });
        return;
      }
      
      // Format appointment date and time in a user-friendly way
      const appointmentDate = new Date(appointment.scheduled_time);
      const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      
      const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
      // Generate personalized reminder message using OpenAI
      const reminderMessage = await ReminderService.generateReminderMessage(
        lead.name,
        formattedDate,
        formattedTime,
        appointment.duration
      );
      
      // Send the SMS reminder
      await twilioClient.messages.create({
        body: reminderMessage,
        from: env.twilioPhoneNumber,
        to: lead.phone,
      });
      
      // Mark reminder as sent
      await AppointmentService.markReminderSent(appointment.id);
      
      logger.info('Appointment reminder sent', { 
        appointmentId: appointment.id, 
        leadId: lead.id, 
        phone: lead.phone 
      });
    } catch (error) {
      logger.error('Error sending appointment reminder', { 
        error, 
        appointmentId: appointment.id 
      });
    }
  }
  
  /**
   * Generate a personalized reminder message using AI
   */
  static async generateReminderMessage(
    customerName: string,
    appointmentDate: string,
    appointmentTime: string,
    durationMinutes: number
  ): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are crafting a friendly SMS reminder for a roof inspection appointment. 
            Keep the message concise (under 160 characters if possible), professional yet warm, 
            and include all essential details. Don't use excessive emoji.`
          },
          {
            role: 'user',
            content: `Generate a reminder message for ${customerName} about their roof inspection appointment on ${appointmentDate} at ${appointmentTime} (duration: ${durationMinutes} minutes).
            Include our company name (Reliable Roofing Solutions) and mention they can reply HELP for assistance or STOP to cancel.`
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });
      
      return completion.choices[0].message.content || 
        `Reminder: Your roof inspection with Reliable Roofing Solutions is scheduled for ${appointmentDate} at ${appointmentTime}. Reply HELP for assistance or STOP to cancel.`;
    } catch (error) {
      logger.error('Error generating reminder message', { error });
      
      // Fallback message if AI generation fails
      return `Reminder: ${customerName}, your roof inspection with Reliable Roofing Solutions is scheduled for ${appointmentDate} at ${appointmentTime}. Reply HELP for assistance or STOP to cancel.`;
    }
  }
  
  /**
   * Handle customer responses to reminder messages
   */
  static async handleReminderResponse(
    fromPhone: string, 
    message: string
  ): Promise<string> {
    try {
      // Normalize message for easier comparison
      const normalizedMessage = message.trim().toUpperCase();
      
      // Get lead by phone number
      const lead = await LeadService.getByPhone(fromPhone);
      
      if (!lead) {
        return "We couldn't find your information. Please contact customer service for assistance.";
      }
      
      // Get upcoming appointments for this lead
      const appointments = await AppointmentService.getByLeadId(lead.id);
      
      // Filter to only get upcoming appointments
      const upcomingAppointments = appointments.filter(appt => {
        const apptTime = new Date(appt.scheduled_time);
        const now = new Date();
        return apptTime > now && (appt.status === 'scheduled' || appt.status === 'confirmed');
      });
      
      if (upcomingAppointments.length === 0) {
        return "We couldn't find any upcoming appointments for you. Please contact customer service for assistance.";
      }
      
      // Sort by date (closest first)
      upcomingAppointments.sort((a, b) => 
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());
      
      // Get the next appointment
      const nextAppointment = upcomingAppointments[0];
      
      // Handle different response types
      if (normalizedMessage === 'HELP') {
        return `For assistance with your roof inspection appointment, please call our office at (555) 123-4567 or reply with one of these options: CONFIRM, RESCHEDULE, or CANCEL.`;
      } else if (normalizedMessage === 'STOP' || normalizedMessage === 'CANCEL') {
        // Cancel the appointment
        await AppointmentService.cancel(nextAppointment.id, 'Cancelled via SMS by customer');
        
        return `Your appointment on ${new Date(nextAppointment.scheduled_time).toLocaleDateString()} has been cancelled. If this was a mistake, please call our office at (555) 123-4567.`;
      } else if (normalizedMessage === 'CONFIRM' || normalizedMessage.includes('YES')) {
        // Confirm the appointment
        await AppointmentService.update(nextAppointment.id, { 
          status: 'confirmed',
          notes: `Confirmed via SMS by customer on ${new Date().toISOString()}`
        });
        
        return `Thank you! Your appointment on ${new Date(nextAppointment.scheduled_time).toLocaleDateString()} at ${new Date(nextAppointment.scheduled_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} has been confirmed. We look forward to seeing you!`;
      } else if (normalizedMessage.includes('RESCHEDULE') || normalizedMessage.includes('CHANGE')) {
        return `To reschedule your appointment, please call our office at (555) 123-4567. We're happy to find a time that works better for you.`;
      } else {
        // For any other response, use AI to interpret and respond appropriately
        return await ReminderService.generateCustomResponse(lead.name, normalizedMessage, nextAppointment);
      }
    } catch (error) {
      logger.error('Error handling reminder response', { error, fromPhone, message });
      return "Sorry, we encountered an issue processing your message. Please call our office at (555) 123-4567 for assistance.";
    }
  }
  
  /**
   * Generate a custom response to an unrecognized message
   */
  static async generateCustomResponse(
    customerName: string,
    customerMessage: string,
    appointment: Appointment
  ): Promise<string> {
    try {
      const appointmentDate = new Date(appointment.scheduled_time);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are responding to a customer's SMS about their roof inspection appointment.
            Be concise, helpful, and professional. Your response should fit in an SMS (under 160 characters if possible).
            The customer has an appointment scheduled for ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`
          },
          {
            role: 'user',
            content: customerMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });
      
      return completion.choices[0].message.content || 
        `To manage your roof inspection appointment scheduled for ${appointmentDate.toLocaleDateString()}, please call our office at (555) 123-4567.`;
    } catch (error) {
      logger.error('Error generating custom response', { error, customerName, customerMessage });
      
      // Fallback message if AI generation fails
      return `Thank you for your message. For assistance with your appointment on ${new Date(appointment.scheduled_time).toLocaleDateString()}, please call our office at (555) 123-4567.`;
    }
  }
}

export default ReminderService; 