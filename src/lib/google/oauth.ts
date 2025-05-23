import { google } from "googleapis";
import { config } from '@/lib/config';

export const oauth2Client = new google.auth.OAuth2(
  config.services.google.clientId,
  config.services.google.clientSecret,
  config.services.google.callbackUrl
); 