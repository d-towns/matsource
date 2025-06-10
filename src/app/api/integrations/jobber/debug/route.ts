import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

/**
 * GET /api/integrations/jobber/debug
 * Debug route to check Jobber configuration (remove in production)
 */
export async function GET(_request: NextRequest) {
  try {
    // Only allow in development
    if (config.env.isProduction) {
      return NextResponse.json(
        { error: 'Debug endpoint not available in production' },
        { status: 404 }
      );
    }

    const debugInfo = {
      environment: config.env.nextPublicNodeEnv,
      hasClientId: !!config.services.jobber.clientId,
      hasClientSecret: !!config.services.jobber.clientSecret,
      clientIdLength: config.services.jobber.clientId?.length || 0,
      clientSecretLength: config.services.jobber.clientSecret?.length || 0,
      baseUrl: config.services.jobber.baseUrl,
      authUrl: config.services.jobber.authUrl,
      tokenUrl: config.services.jobber.tokenUrl,
      callbackUrl: config.services.jobber.callbackUrl,
      scopes: config.services.jobber.scopes,
      // Don't expose actual credentials
      clientIdPreview: config.services.jobber.clientId?.substring(0, 8) + '...',
    };

    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Debug endpoint failed' },
      { status: 500 }
    );
  }
} 