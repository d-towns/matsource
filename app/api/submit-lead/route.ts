import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

// Load service account credentials from environment variables
const SHEET_NAME = 'Leads';

type LeadData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  source: string;
  utmParams: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LeadData = await request.json();
    const { fullName, email, phoneNumber, source, utmParams } = body;
    
    // Basic validation
    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get IP and user agent for tracking
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Add data to Google Sheet
    await addToGoogleSheet({
      timestamp,
      fullName,
      email,
      phoneNumber,
      source,
      ip,
      userAgent,
      ...utmParams
    });
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

async function addToGoogleSheet(data: Record<string, string>) {
  try {
    // console.log(process.env.GOOGLE_PROJECT_ID, process.env.GOOGLE_PRIVATE_KEY, process.env.GOOGLE_CLIENT_EMAIL)
    if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error('Missing Google Sheets configuration');
    }
    
    // Parse the service account credentials
    // you can find the credentials in the google cloud console
    // use the service account key, it can be found in the service account section
    
    
    // Create auth client
    const auth = new GoogleAuth({
      credentials: {
          type: "service_account",
          project_id: process.env.GOOGLE_PROJECT_ID,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix line breaks
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
    // Create sheets client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Prepare the row data
    const values = [
      [
        data.timestamp,
        data.fullName,
        data.email,
        data.phoneNumber,
        data.source,
        data.utm_source || '',
        data.utm_medium || '',
        data.utm_campaign || '',
        data.utm_content || '',
        data.utm_term || '',
        data.ip,
        data.userAgent
      ],
    ];
    
    // Append to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Google Sheets API error:', error);
    throw error;
  }
} 