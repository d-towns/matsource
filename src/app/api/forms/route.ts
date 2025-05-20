import { NextRequest, NextResponse } from "next/server";
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { FormsService } from '@/lib/services/FormsService';

/**
 * GET /api/forms?teamId=...
 * List all forms (with domains) for the given team
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const teamId = request.nextUrl.searchParams.get('teamId');
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  try {
    const forms = await FormsService.getFormsWithDomainsByTeam(teamId);
    console.log('forms', forms)
    return NextResponse.json({ forms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

/**
 * POST /api/forms
 * Create a new form for the given team
 * Body: { teamId, ... }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { teamId, ...formData } = body;
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  try {
    const created = await FormsService.createForm({ ...formData, team_id: teamId, user_id: user.id });
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
  }
}

/**
 * DELETE /api/forms
 * Body: { teamId, id }
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { teamId, id } = body;
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
  }
  try {
    await FormsService.deleteForm(id, teamId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
} 