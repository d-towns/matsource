import { Request, Response } from 'express';
import { TwilioService, CallAttemptService, LeadService } from '../services';
import logger from '../config/logger';

export class TwilioController {
  /**
   * Generate TwiML for initial call
   */
  static async generateTwiML(req: Request, res: Response): Promise<void> {
    try {
      const callAttemptId = req.params.callId;
      
      if (!callAttemptId) {
        res.status(400).json({
          success: false,
          message: 'Call attempt ID is required',
        });
        return;
      }
      
      // Check if call attempt exists
      const callAttempt = await CallAttemptService.getById(callAttemptId);
      
      if (!callAttempt) {
        res.status(404).json({
          success: false,
          message: 'Call attempt not found',
        });
        return;
      }
      
      // Generate TwiML
      const twiml = TwilioService.generateInitialTwiML(callAttemptId);
      
      // Send TwiML response
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      logger.error('Error generating TwiML', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to generate TwiML',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  /**
   * Handle response webhook from Twilio
   */
  static async handleResponse(req: Request, res: Response): Promise<void> {
    try {
      const callAttemptId = req.params.callId;
      
      if (!callAttemptId) {
        res.status(400).json({
          success: false,
          message: 'Call attempt ID is required',
        });
        return;
      }
      
      // Log all incoming Twilio parameters for debugging
      logger.debug('Twilio webhook received', { 
        params: req.params,
        body: req.body,
        query: req.query,
        callAttemptId
      });
      
      // Check if call attempt exists
      const callAttempt = await CallAttemptService.getById(callAttemptId);
      
      if (!callAttempt) {
        res.status(404).json({
          success: false,
          message: 'Call attempt not found',
        });
        return;
      }
      
      // Get user input from Twilio
      const userInput = req.body.SpeechResult;
      
      if (!userInput) {
        // Handle no input
        const twiml = await TwilioService.generateNoInputTwiML(callAttemptId);
        res.type('text/xml');
        res.send(twiml);
        return;
      }
      
      // Extract additional data from Twilio webhook
      const confidence = req.body.Confidence ? parseFloat(req.body.Confidence) : undefined;
      const callStatus = req.body.CallStatus || 'in_progress';
      const callDuration = req.body.CallDuration ? parseInt(req.body.CallDuration) : undefined;
      
      // Generate AI response and TwiML
      const twiml = await TwilioService.generateResponseTwiML(
        callAttemptId,
        userInput,
        callStatus
      );
      
      // Send TwiML response
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      logger.error('Error handling response', { error });
      
      // Return a basic TwiML response to gracefully end the call
      const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, I encountered an error. Please try again later. Goodbye.</Say>
  <Hangup/>
</Response>`;
      
      res.type('text/xml');
      res.send(errorTwiML);
    }
  }
  
  /**
   * Handle no input from user
   */
  static async handleNoInput(req: Request, res: Response): Promise<void> {
    try {
      const callAttemptId = req.params.callId;
      
      if (!callAttemptId) {
        res.status(400).json({
          success: false,
          message: 'Call attempt ID is required',
        });
        return;
      }
      
      // Generate no input TwiML
      const twiml = await TwilioService.generateNoInputTwiML(callAttemptId);
      
      // Send TwiML response
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      logger.error('Error handling no input', { error });
      
      // Return a basic TwiML response to gracefully end the call
      const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, I encountered an error. Please try again later. Goodbye.</Say>
  <Hangup/>
</Response>`;
      
      res.type('text/xml');
      res.send(errorTwiML);
    }
  }
  
  /**
   * Handle status callbacks from Twilio
   */
  static async handleStatusCallback(req: Request, res: Response): Promise<void> {
    try {
      const callAttemptId = req.params.callId;
      const status = req.body.CallStatus;
      
      if (!callAttemptId || !status) {
        res.status(400).json({
          success: false,
          message: 'Call attempt ID and status are required',
        });
        return;
      }
      
      // Extract additional data from Twilio webhook
      const callDuration = req.body.CallDuration ? parseInt(req.body.CallDuration) : undefined;
      
      // Handle status
      await TwilioService.handleStatusCallback(callAttemptId, status, callDuration);
      
      // Send success response
      res.status(200).json({
        success: true,
        message: 'Status processed successfully',
      });
    } catch (error) {
      logger.error('Error handling status callback', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to process status callback',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  /**
   * Handle partial speech results for more responsive conversation
   */
  static async handlePartialResult(req: Request, res: Response): Promise<void> {
    try {
      const callAttemptId = req.params.callId;
      const partialResult = req.body.SpeechResult;
      
      if (!callAttemptId || !partialResult) {
        res.status(400).json({
          success: false,
          message: 'Call attempt ID and partial result are required',
        });
        return;
      }
      
      // Process the partial result
      await TwilioService.handlePartialResult(callAttemptId, partialResult);
      
      // Send success response - Twilio doesn't need a TwiML response for partial callbacks
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      logger.error('Error handling partial result', { error });
      
      res.status(500).json({
        success: false,
        message: 'Failed to process partial result',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  /**
   * Provide barge-in capabilities for more natural conversation
   */
  static async handleBargeIn(req: Request, res: Response): Promise<void> {
    try {
      const callAttemptId = req.params.callId;
      
      if (!callAttemptId) {
        res.status(400).json({
          success: false,
          message: 'Call attempt ID is required',
        });
        return;
      }
      
      // Get user input that interrupted the AI
      const userInput = req.body.SpeechResult;
      
      if (!userInput) {
        // If no input detected during barge-in, just continue with standard response
        const twiml = await TwilioService.generateNoInputTwiML(callAttemptId);
        res.type('text/xml');
        res.send(twiml);
        return;
      }
      
      // Generate AI response to the interruption with higher priority/urgency
      const twiml = await TwilioService.generateResponseTwiML(
        callAttemptId,
        userInput,
        'barge_in'
      );
      
      // Send TwiML response
      res.type('text/xml');
      res.send(twiml);
    } catch (error) {
      logger.error('Error handling barge in', { error });
      
      // Return a basic TwiML response to gracefully continue the call
      const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>I'm sorry, could you repeat that please?</Say>
  <Gather input="speech" action="/api/calls/respond/${req.params.callId}" method="POST" 
         speechTimeout="auto" speechModel="phone_call" enhanced="true">
    <Pause length="1"/>
  </Gather>
</Response>`;
      
      res.type('text/xml');
      res.send(errorTwiML);
    }
  }
}

export default TwilioController; 