import OpenAI from 'openai';
import { env } from '../config/environment';
import logger from '../config/logger';
import axios from 'axios';

// Create OpenAI client
const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});

// Enhanced conversation context management
type ConversationContext = {
  leadName: string;
  leadSource?: string;
  leadEmail?: string;
  previousMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  callStatus: string;
  callDuration?: number;
  attemptCount?: number;
  detectedIntent?: string;
  confidence?: number;
  userSentiment?: 'positive' | 'neutral' | 'negative';
  leadInterest?: 'high' | 'medium' | 'low' | 'unknown';
};

export class OpenAIService {
  /**
   * Transcribe audio from Twilio stream
   */
  static async transcribeAudio(audioUrl: string): Promise<string> {
    try {
      // Fetch audio from URL and convert to appropriate format for OpenAI
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      
      // Use OpenAI Whisper API to transcribe the audio
      const transcription = await openai.audio.transcriptions.create({
        file: new File([audioBlob], 'audio.wav'),
        model: 'whisper-1',
      });
      
      return transcription.text;
    } catch (error) {
      logger.error('Error transcribing audio', { error });
      throw error;
    }
  }
  
  /**
   * Generate natural conversation response
   */
  static async generateResponse(
    userInput: string, 
    context: ConversationContext
  ): Promise<string> {
    try {
      const { leadName, previousMessages, callStatus } = context;
      
      // System message to guide the AI on being conversational and natural
      const systemMessage = {
        role: 'system',
        content: `You are Alex, a friendly and professional appointment setter for a roofing company. 
        Your goal is to have a natural conversation with ${leadName} to schedule a free roof inspection.
        
        Important guidelines:
        - Be conversational and natural, as if you're a real person having a casual conversation
        - Avoid sounding like a script or a traditional IVR system
        - Use natural pauses, filler words occasionally, and conversational transitions
        - Adapt to the customer's tone and energy level
        - Listen carefully to objections and address them naturally
        - Don't rush to schedule - build rapport and trust first
        - If the customer is interested, try to set a specific date and time for the inspection
        - If they're hesitant, offer to call back at a more convenient time
        - Remember, this is a conversation, not an interrogation or survey
        
        Current call status: ${callStatus}
        Lead info: ${leadName} submitted a request through our Facebook ad.`
      };
      
      // Prepare conversation messages for the model
      const conversationMessages = [
        systemMessage,
        ...previousMessages,
        { role: 'user', content: userInput },
      ];
      
      // Use chat completions to generate a natural response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: conversationMessages as any,
        temperature: 0.7, // Add some variability for more natural responses
        max_tokens: 300,
        top_p: 0.95,
        frequency_penalty: 0.5, // Reduce repetition
        presence_penalty: 0.5, // Encourage addressing new topics from user input
      });
      
      return completion.choices[0].message.content || "I'm sorry, I didn't catch that. Could you please repeat?";
    } catch (error) {
      logger.error('Error generating response', { error });
      return "I'm sorry, I'm having trouble understanding. Could we try again in a moment?";
    }
  }
  
  /**
   * Convert text to natural-sounding speech
   */
  static async textToSpeech(text: string, voiceStyle: string = 'conversational'): Promise<Buffer> {
    try {
      // Use OpenAI TTS with enhanced voice characteristics
      const response = await openai.audio.speech.create({
        model: 'tts-1-hd',
        voice: 'nova', // Using Nova for a natural female voice
        input: text,
        speed: 0.97, // Slightly slower for more natural pacing
      });
      
      // Get the speech audio as buffer
      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    } catch (error) {
      logger.error('Error converting text to speech', { error });
      throw error;
    }
  }
  
  /**
   * Enhanced conversation analysis with sentiment and intent detection
   */
  static async analyzeConversation(
    conversation: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<{
    appointmentScheduled: boolean;
    scheduledDateTime?: string;
    duration?: number;
    notes?: string;
    callbackRequested?: boolean;
    bestCallbackTime?: string;
    customerSentiment: 'positive' | 'neutral' | 'negative';
    leadQuality: 'hot' | 'warm' | 'cold';
    detectedIntents: string[];
    suggestedFollowUp?: string;
  }> {
    try {
      // Filter out system messages for analysis
      const conversationForAnalysis = conversation.filter(msg => msg.role !== 'system');
      
      // Add a system message for analysis context
      const analysisMessages = [
        {
          role: 'system',
          content: `Analyze this conversation between an AI appointment setter and a potential customer. 
          Extract the following information:
          1. Was an appointment successfully scheduled? If yes, extract the date, time, and duration.
          2. If no appointment was scheduled, did the customer request a callback? If yes, when?
          3. What was the customer's overall sentiment? (positive, neutral, negative)
          4. How would you rate this lead quality? (hot, warm, cold)
          5. What were the main intents expressed by the customer?
          6. What notes would be relevant for a sales team following up?
          7. What's the suggested next action?
          
          Format your response as structured data in JSON format.`
        },
        ...conversationForAnalysis,
        {
          role: 'user',
          content: 'Please analyze this conversation and provide the structured data as requested.'
        }
      ];
      
      // Use chat completions for analysis
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: analysisMessages as any,
        temperature: 0.1, // Low temperature for more factual analysis
        response_format: { type: 'json_object' },
      });
      
      // Parse JSON response
      const analysisText = completion.choices[0].message.content || '{}';
      const analysis = JSON.parse(analysisText);
      
      return {
        appointmentScheduled: analysis.appointmentScheduled || false,
        scheduledDateTime: analysis.scheduledDateTime,
        duration: analysis.duration,
        notes: analysis.notes,
        callbackRequested: analysis.callbackRequested || false,
        bestCallbackTime: analysis.bestCallbackTime,
        customerSentiment: analysis.customerSentiment || 'neutral',
        leadQuality: analysis.leadQuality || 'warm',
        detectedIntents: analysis.detectedIntents || [],
        suggestedFollowUp: analysis.suggestedFollowUp,
      };
    } catch (error) {
      logger.error('Error analyzing conversation', { error });
      // Return default values in case of error
      return {
        appointmentScheduled: false,
        customerSentiment: 'neutral',
        leadQuality: 'warm',
        detectedIntents: ['error_during_analysis'],
      };
    }
  }
  
  /**
   * Detect user sentiment from input
   */
  static async detectSentiment(userInput: string): Promise<'positive' | 'neutral' | 'negative'> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'Analyze the sentiment of the following text and respond with exactly one word: "positive", "neutral", or "negative".'
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.1,
        max_tokens: 10,
      });
      
      const sentiment = completion.choices[0].message.content?.trim().toLowerCase();
      
      if (sentiment === 'positive' || sentiment === 'negative') {
        return sentiment;
      }
      
      return 'neutral';
    } catch (error) {
      logger.error('Error detecting sentiment', { error });
      return 'neutral';
    }
  }
  
  /**
   * Generate streaming voice response
   * This allows for more natural real-time conversation
   */
  static async generateStreamingResponse(
    userInput: string,
    context: ConversationContext
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      const { leadName, previousMessages, callStatus } = context;
      
      // System message to guide the AI
      const systemMessage = {
        role: 'system',
        content: `You are Alex, a friendly and professional appointment setter for a roofing company. 
        Your goal is to have a natural conversation with ${leadName} to schedule a free roof inspection.
        
        Important guidelines:
        - Be conversational and natural, as if you're a real person having a casual conversation
        - Avoid sounding like a script or a traditional phone system
        - Use natural pauses, filler words occasionally, and conversational transitions
        - Adapt to the customer's tone and energy level
        
        Current call status: ${callStatus}
        Lead info: ${leadName} submitted a request through our Facebook ad.`
      };
      
      // Prepare conversation messages for the model
      const conversationMessages = [
        systemMessage,
        ...previousMessages,
        { role: 'user', content: userInput },
      ];
      
      // Use streaming completion for more natural response timing
      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: conversationMessages as any,
        temperature: 0.7,
        max_tokens: 300,
        stream: true,
      });
      
      // Process the stream and convert to speech in chunks
      // This is a conceptual implementation - actual streaming would need more infrastructure
      return stream as unknown as ReadableStream<Uint8Array>;
    } catch (error) {
      logger.error('Error generating streaming response', { error });
      throw error;
    }
  }
}

export default OpenAIService; 