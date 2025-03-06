import { Request, Response } from 'express';
import { ReminderService } from '../services';
import logger from '../config/logger';
import { Twilio } from 'twilio';

/**
 * Controller for handling SMS-related operations
 */
export class SmsController {
  /**
   * Handle incoming SMS webhook from Twilio
   */
  static async handleIncomingSms(req: Request, res: Response): Promise<void> {
    try {
      // Validate the request is from Twilio if desired
      // const isValid = SmsController.validateTwilioRequest(req);
      // if (!isValid) { ... }
      
      // Extract SMS details from request body
      const from = req.body.From;
      const to = req.body.To;
      const body = req.body.Body;
      const messageSid = req.body.MessageSid;
      
      logger.info('Incoming SMS received', { 
        from, 
        to, 
        messageSid,
        bodyLength: body ? body.length : 0
      });
      
      if (!from || !body) {
        res.status(400).set('Content-Type', 'text/xml').send(
          `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Invalid request. From phone number and message body are required.</Message>
</Response>`
        );
        return;
      }
      
      // Process the SMS message
      const responseMessage = await ReminderService.handleReminderResponse(from, body);
      
      // Return TwiML response
      res.set('Content-Type', 'text/xml').send(
        `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`
      );
    } catch (error) {
      logger.error('Error handling incoming SMS', { error });
      
      // Return a generic error response
      res.status(500).set('Content-Type', 'text/xml').send(
        `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, we encountered an error processing your message. Please call our office for assistance.</Message>
</Response>`
      );
    }
  }
  
  /**
   * Send SMS manually to a specific phone number
   */
  static async sendSms(req: Request, res: Response): Promise<void> {
    try {
      // Validate request
      const { phone, message } = req.body;
      
      if (!phone || !message) {
        res.status(400).json({
          success: false,
          message: 'Phone number and message are required',
        });
        return;
      }
      
      // Get Twilio client and send message
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      
      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        res.status(500).json({
          success: false,
          message: 'Twilio configuration is missing',
        });
        return;
      }
      
      const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
      
      // Send SMS
      const twilioMessage = await twilioClient.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: phone,
      });
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'SMS sent successfully',
        data: {
          sid: twilioMessage.sid,
          status: twilioMessage.status,
        },
      });
    } catch (error) {
      logger.error('Error sending SMS', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to send SMS',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  /**
   * Send a test reminder to a specific phone number
   */
  static async sendTestReminder(req: Request, res: Response): Promise<void> {
    try {
      // Validate request
      const { phone, name, appointmentDate, appointmentTime } = req.body;
      
      if (!phone || !name || !appointmentDate || !appointmentTime) {
        res.status(400).json({
          success: false,
          message: 'Phone number, name, appointment date, and appointment time are required',
        });
        return;
      }
      
      // Generate reminder message using ReminderService
      const reminderMessage = await ReminderService.generateReminderMessage(
        name,
        appointmentDate,
        appointmentTime,
        60 // Default duration
      );
      
      // Get Twilio client and send message
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      
      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        res.status(500).json({
          success: false,
          message: 'Twilio configuration is missing',
        });
        return;
      }
      
      const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
      
      // Send SMS
      const twilioMessage = await twilioClient.messages.create({
        body: reminderMessage,
        from: twilioPhoneNumber,
        to: phone,
      });
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Test reminder sent successfully',
        data: {
          sid: twilioMessage.sid,
          status: twilioMessage.status,
          reminderText: reminderMessage,
        },
      });
    } catch (error) {
      logger.error('Error sending test reminder', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to send test reminder',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  /**
   * Validate that a request is actually from Twilio
   * This is just a placeholder - in a real production environment, you'd implement proper validation
   */
  private static validateTwilioRequest(req: Request): boolean {
    // In a real implementation, you would:
    // 1. Get the X-Twilio-Signature header
    // 2. Validate it against the request URL and body using the Twilio helper library
    // 3. Return true only if the signature is valid
    
    // For now, just return true
    return true;
  }
}

export default SmsController; 