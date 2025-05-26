import { NextRequest, NextResponse } from "next/server"
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { ApiKeyService } from '@/lib/services/ApiKeyService';

/**
 * GET /api/api-keys?teamId=...
 * List all API keys for the given team
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const teamId = request.nextUrl.searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  // Get all API keys for the current team (excluding the actual keys which are hashed)
  const { data: keys, error } = await supabase
    .from("api_keys")
    .select("id, name, created_at, last_used_at")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }

  return NextResponse.json({ keys })
}

/**
 * POST /api/api-keys
 * Create a new API key for the given team
 * Body: { teamId, name }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await request.json();
  const { teamId, name } = body;
  if (!teamId) {
    console.log('teamId is required')
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  if (!name || typeof name !== "string") {
    console.log('name is required')
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  try {
    // Use the ApiKeyService to create the key
    const result = await ApiKeyService.createApiKey(name, user.id, teamId);
    // Return the API key (this is the only time the API key will be visible to the user)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
} 