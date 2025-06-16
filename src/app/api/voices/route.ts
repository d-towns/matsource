import { NextRequest, NextResponse } from "next/server";
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { VoiceService, Voice } from '@/lib/services/VoiceService';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/voices?provider=...
 * List all voices or filter by provider
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = request.nextUrl.searchParams.get('provider') as Voice['provider'] | null;
  
  try {
    let voices;
    if (provider) {
      voices = await VoiceService.getVoicesByProvider(provider);
    } else {
      voices = await VoiceService.getVoices();
    }
    
    const response = NextResponse.json({ voices });
    
    // Prevent caching of dynamic data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error fetching voices:", error);
    return NextResponse.json({ error: "Failed to fetch voices" }, { status: 500 });
  }
} 