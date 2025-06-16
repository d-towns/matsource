import { NextRequest, NextResponse } from "next/server";
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { ModelService, Model } from '@/lib/services/ModelService';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/models?provider=...&tier=...
 * List all models or filter by provider and/or tier
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = request.nextUrl.searchParams.get('provider') as Model['provider'] | null;
  const tier = request.nextUrl.searchParams.get('tier') as Model['tier'] | null;
  
  try {
    let models;
    if (provider && tier) {
      // Filter by both provider and tier
      const allModels = await ModelService.getModels();
      models = allModels.filter(m => m.provider === provider && m.tier === tier);
    } else if (provider) {
      models = await ModelService.getModelsByProvider(provider);
    } else if (tier) {
      models = await ModelService.getModelsByTier(tier);
    } else {
      models = await ModelService.getModels();
    }
    
    const response = NextResponse.json({ models });
    
    // Prevent caching of dynamic data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
} 