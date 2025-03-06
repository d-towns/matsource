import { Twilio } from 'twilio';
import { env } from '../config/environment';
import logger from '../config/logger';
import { CallAttemptService, LeadService, OpenAIService } from './';

// Initialize Twilio client
const twilioClient = new Twilio(env.twilioAccountSid, env.twilioAuthToken);

// Enhanced conversation context type
type ConversationContext = {
  callAttemptId: string;
  leadId: string;
  leadName: string;
  leadSource?: string;
  leadEmail?: string;
  callDuration?: number;
  callStartTime?: Date;
  attemptCount?: number;
  detectedIntent?: string;
  userSentiment?: 'positive' | 'neutral' | 'negative';
  leadInterest?: 'high' | 'medium' | 'low' | 'unknown';
  lastCallResult?: string;
};

// Enhanced message type with metadata
type ConversationMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    sentiment?: 'positive' | 'neutral' | 'negative';
    detected_intent?: string;
    confidence?: number;
    speech_duration_ms?: number;
    silence_before_response_ms?: number;
    barge_in?: boolean;
  };
};

// Active call contexts - in a production implementation, this would be in a database
const activeCallContexts = new Map<string, ConversationContext>();
// Active conversations - in a production implementation, this would be in a database
const conversations = new Map<string, ConversationMessage[]>();

export class TwilioService {
  /**
   * Generate TwiML for initial call
   */
  static generateInitialTwiML(callAttemptId: string): string {
    try {
      logger.info('Generating initial TwiML', { callAttemptId });

      // Hard-coded TwiML for now, but with enhanced settings for more natural conversation
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/calls/respond/${callAttemptId}" method="POST" 
         speechTimeout="auto" speechModel="phone_call" enhanced="true" 
         speechTimeout="1" profanityFilter="false" hints="yes,no,maybe,sure,appointment,schedule,roof,inspection">
    <Pause length="1"/>
  </Gather>
  <Redirect method="POST">/api/calls/no-input/${callAttemptId}</Redirect>
</Response>`;
    } catch (error) {
      logger.error('Error generating initial TwiML', { error });
      
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, there was an error with this call. Goodbye.</Say>
  <Hangup/>
</Response>`;
    }
  }
  
  /**
   * Generate TwiML for AI response - with focus on natural conversation
   */
  static async generateResponseTwiML(
    callAttemptId: string, 
    userInput: string,
    callStatus: string = 'in_progress'
  ): Promise<string> {
    try {
      logger.info('Handling user input', { callAttemptId, userInput });
      
      // Get call attempt details
      const callAttempt = await CallAttemptService.getById(callAttemptId);
      
      if (!callAttempt) {
        throw new Error(`Call attempt not found: ${callAttemptId}`);
      }
      
      // Get lead details
      const lead = await LeadService.getById(callAttempt.lead_id);
      
      if (!lead) {
        throw new Error(`Lead not found: ${callAttempt.lead_id}`);
      }
      
      // Initialize or retrieve conversation context
      let context = activeCallContexts.get(callAttemptId);
      if (!context) {
        context = {
          callAttemptId,
          leadId: lead.id,
          leadName: lead.name,
          leadSource: lead.source,
          leadEmail: lead.email,
          callStartTime: new Date(),
          attemptCount: 1
        };
        activeCallContexts.set(callAttemptId, context);
      }
      
      // Get conversation history
      const conversationHistory = await TwilioService.getConversationHistory(callAttemptId);
      
      // Analyze sentiment of user input (could be done in parallel)
      const sentiment = await OpenAIService.detectSentiment(userInput);
      
      // Update context with sentiment
      context.userSentiment = sentiment;
      activeCallContexts.set(callAttemptId, context);
      
      // Convert conversation history to OpenAI format
      const previousMessages = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Generate AI response using enhanced context
      const aiResponse = await OpenAIService.generateResponse(userInput, {
        leadName: lead.name,
        leadSource: lead.source,
        leadEmail: lead.email,
        previousMessages,
        callStatus,
        callDuration: context.callDuration,
        attemptCount: context.attemptCount,
        userSentiment: sentiment,
        leadInterest: context.leadInterest
      });
      
      // Save the conversation turns with metadata
      await TwilioService.saveConversationTurn(
        callAttemptId, 
        'user', 
        userInput, 
        { sentiment }
      );
      
      await TwilioService.saveConversationTurn(
        callAttemptId, 
        'assistant', 
        aiResponse
      );
      
      // Update call tracking metrics
      if (context.callStartTime) {
        context.callDuration = (new Date().getTime() - context.callStartTime.getTime()) / 1000;
        activeCallContexts.set(callAttemptId, context);
      }
      
      // Generate natural-sounding TwiML 
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/calls/respond/${callAttemptId}" method="POST" 
         speechTimeout="auto" speechModel="phone_call" enhanced="true" 
         speechTimeout="1" profanityFilter="false" partialResultsCallback="/api/calls/partial/${callAttemptId}" 
         hints="yes,no,maybe,sure,appointment,schedule,roof,inspection,interested,not interested">
    <Say voice="Polly.Joanna">${aiResponse}</Say>
  </Gather>
  <Redirect method="POST">/api/calls/no-input/${callAttemptId}</Redirect>
</Response>`;
    } catch (error) {
      logger.error('Error generating response TwiML', { error, callAttemptId });
      
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, I encountered an error processing your response. Please try again later. Goodbye.</Say>
  <Hangup/>
</Response>`;
    }
  }
  
  /**
   * Generate TwiML for no input received - with more conversational approach
   */
  static async generateNoInputTwiML(callAttemptId: string): Promise<string> {
    try {
      // Get call context if available
      const context = activeCallContexts.get(callAttemptId);
      
      // Update call attempt with no response
      await CallAttemptService.update(callAttemptId, {
        notes: 'No input received from customer',
      });
      
      // For more natural conversation, vary the no-input response based on context
      let noInputResponse = "I didn't hear anything. Are you still there?";
      
      // If we have context, make the no-input response more personalized
      if (context) {
        // Increment missed response count in context
        const missedResponses = context.attemptCount || 0;
        context.attemptCount = missedResponses + 1;
        activeCallContexts.set(callAttemptId, context);
        
        // Vary the response based on how many times we've tried
        if (missedResponses >= 2) {
          return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>I still don't hear anything. I'll try to reach you at a better time. Thank you and goodbye.</Say>
  <Hangup/>
</Response>`;
        } else if (missedResponses === 1) {
          noInputResponse = "Hmm, I'm having trouble hearing you. If you're still interested in a roof inspection, could you say 'yes' or just make any sound so I know you're there?";
        }
      }
      
      // Generate TwiML with natural-sounding no-input handling
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${noInputResponse}</Say>
  <Gather input="speech" action="/api/calls/respond/${callAttemptId}" method="POST" 
         speechTimeout="auto" speechModel="phone_call" enhanced="true" 
         speechTimeout="1" profanityFilter="false">
    <Pause length="1"/>
  </Gather>
  <Say>I still don't hear anything. I'll try to reach you at a better time. Thank you and goodbye.</Say>
  <Hangup/>
</Response>`;
    } catch (error) {
      logger.error('Error generating no-input TwiML', { error, callAttemptId });
      
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>I'm having trouble with this call. Let me call you back later. Goodbye.</Say>
  <Hangup/>
</Response>`;
    }
  }
  
  /**
   * Handle partial results from speech recognition
   * This allows for more responsive conversation by starting to process responses
   * before the user has finished speaking
   */
  static async handlePartialResult(callAttemptId: string, partialResult: string): Promise<void> {
    try {
      logger.info('Received partial speech result', { callAttemptId, partialResult });
      
      // In a full implementation, we could start processing the AI response
      // while the user is still speaking, to minimize delay
      
      // For now, just log the partial result
    } catch (error) {
      logger.error('Error handling partial result', { error, callAttemptId });
    }
  }
  
  /**
   * Handle call status webhooks from Twilio with enhanced analytics
   */
  static async handleStatusCallback(callAttemptId: string, status: string, callDuration?: number): Promise<void> {
    try {
      // Get call attempt details
      const callAttempt = await CallAttemptService.getById(callAttemptId);
      
      if (!callAttempt) {
        throw new Error(`Call attempt not found: ${callAttemptId}`);
      }
      
      let callStatus = callAttempt.status;
      
      // Map Twilio status to our status
      switch (status) {
        case 'initiated':
        case 'ringing':
          callStatus = 'in_progress';
          break;
        case 'in-progress':
          callStatus = 'in_progress';
          break;
        case 'completed':
          callStatus = 'completed';
          
          // When call is completed, analyze the conversation
          await TwilioService.analyzeCompletedCall(callAttemptId);
          
          // Clean up call context
          activeCallContexts.delete(callAttemptId);
          break;
        case 'busy':
        case 'no-answer':
        case 'failed':
          callStatus = 'failed';
          activeCallContexts.delete(callAttemptId);
          break;
        case 'canceled':
          callStatus = 'failed';
          activeCallContexts.delete(callAttemptId);
          break;
      }
      
      // Update call attempt status with additional details
      const updateData: any = {
        status: callStatus as any,
      };
      
      // If call duration is provided, update that too
      if (callDuration) {
        updateData.duration = callDuration;
      }
      
      // If call is completed or failed, add end time
      if (callStatus === 'completed' || callStatus === 'failed') {
        updateData.end_time = new Date().toISOString();
      }
      
      await CallAttemptService.update(callAttemptId, updateData);
      
    } catch (error) {
      logger.error('Error handling status callback', { error, callAttemptId, status });
      throw error;
    }
  }
  
  /**
   * Get conversation history with enhanced context
   */
  static async getConversationHistory(callAttemptId: string): Promise<ConversationMessage[]> {
    try {
      // Get from memory cache first (in production, this would be from database)
      const cachedConversation = conversations.get(callAttemptId);
      if (cachedConversation) {
        return cachedConversation;
      }
      
      // If not in cache, initialize with system prompt
      const conversation: ConversationMessage[] = [
        {
          role: 'system',
          content: 'You are a professional appointment setter for a roofing company. Your goal is to have a natural conversation to schedule a roof inspection appointment.',
          timestamp: new Date(),
        },
        {
          role: 'assistant',
          content: "Hi there! This is Alex from Reliable Roofing Solutions. I'm calling about the roof inspection request you submitted through our Facebook ad. Is this a good time to talk for a moment?",
          timestamp: new Date(),
        }
      ];
      
      // Store in cache
      conversations.set(callAttemptId, conversation);
      
      return conversation;
    } catch (error) {
      logger.error('Error getting conversation history', { error, callAttemptId });
      return [];
    }
  }
  
  /**
   * Save a conversation turn with metadata
   */
  static async saveConversationTurn(
    callAttemptId: string,
    role: 'system' | 'user' | 'assistant',
    content: string,
    metadata?: ConversationMessage['metadata']
  ): Promise<void> {
    try {
      // Create message with timestamp and any metadata
      const message: ConversationMessage = {
        role,
        content,
        timestamp: new Date(),
        metadata
      };
      
      // Get existing conversation
      const conversation = await TwilioService.getConversationHistory(callAttemptId);
      
      // Add new message
      conversation.push(message);
      
      // Update in cache
      conversations.set(callAttemptId, conversation);
      
      // In a production implementation, this would be saved to a database
      logger.info('Conversation turn saved', { 
        callAttemptId, 
        role, 
        contentLength: content.length,
        metadata 
      });
    } catch (error) {
      logger.error('Error saving conversation turn', { error, callAttemptId });
    }
  }
  
  /**
   * Analyze a completed call with enhanced analysis
   */
  static async analyzeCompletedCall(callAttemptId: string): Promise<void> {
    try {
      // Get call attempt details
      const callAttempt = await CallAttemptService.getById(callAttemptId);
      
      if (!callAttempt) {
        throw new Error(`Call attempt not found: ${callAttemptId}`);
      }
      
      // Get conversation history
      const conversationHistory = await TwilioService.getConversationHistory(callAttemptId);
      
      // Convert to format expected by OpenAI
      const conversationForAnalysis = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Enhanced analysis with sentiment and intent detection
      const analysis = await OpenAIService.analyzeConversation(conversationForAnalysis);
      
      // Update call attempt with results
      const updateData: any = {
        notes: `Analysis: ${JSON.stringify(analysis, null, 2)}`,
      };
      
      // Update result based on analysis
      if (analysis.appointmentScheduled) {
        updateData.result = 'appointment_set';
      } else if (analysis.callbackRequested) {
        updateData.result = 'call_back_later';
      } else if (analysis.customerSentiment === 'negative') {
        updateData.result = 'not_interested';
      }
      
      await CallAttemptService.update(callAttemptId, updateData);
      
      // Update lead with sentiment and quality information
      await LeadService.update(callAttempt.lead_id, {
        notes: `Lead quality: ${analysis.leadQuality}, Sentiment: ${analysis.customerSentiment}`,
      });
      
      // If appointment was set, create an appointment record
      if (analysis.appointmentScheduled && analysis.scheduledDateTime) {
        logger.info('Appointment scheduled', { 
          callAttemptId, 
          leadId: callAttempt.lead_id,
          scheduledDateTime: analysis.scheduledDateTime 
        });
        
        // Update lead status
        await LeadService.update(callAttempt.lead_id, {
          status: 'appointment_set',
        });
        
        // In a production implementation, we would create an appointment record
        // through the AppointmentService
      }
      
      // Clean up conversation cache
      conversations.delete(callAttemptId);
      
    } catch (error) {
      logger.error('Error analyzing completed call', { error, callAttemptId });
    }
  }
  
  /**
   * Generate a barge-in friendly TwiML that allows for more natural conversation
   * where the caller can interrupt the AI
   */
  static generateBargeInTwiML(callAttemptId: string, message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/calls/respond/${callAttemptId}" method="POST" 
         speechTimeout="auto" speechModel="phone_call" enhanced="true"
         interruptible="true" profanityFilter="false">
    <Say voice="Polly.Joanna">${message}</Say>
  </Gather>
  <Redirect method="POST">/api/calls/no-input/${callAttemptId}</Redirect>
</Response>`;
  }
}

export default TwilioService; 