import { Twilio } from 'twilio';
import { config } from '@/lib/config';

export const twilioClient = new Twilio(config.services.twilio.accountSid, config.services.twilio.authToken);
