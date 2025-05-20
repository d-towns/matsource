import { NextRequest, NextResponse } from "next/server"
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { ApiKeyService } from '@/lib/services/ApiKeyService';

/**
 * DELETE /api/api-keys/:id
 * Body: { teamId }
 * Revoke an API key by ID for the given team
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();
  const { teamId } = body;
  if (!id) {
    return NextResponse.json({ error: "API key ID is required" }, { status: 400 })
  }
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  // First, verify that the API key belongs to the current user
  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("user_id, team_id")
    .eq("id", id)
    .single()
  if (keyError || !keyData) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 })
  }
  if (keyData.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  // Use the ApiKeyService to delete the key
  try {
    await ApiKeyService.deleteApiKey(id, teamId);
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
} 