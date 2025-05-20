import { NextRequest, NextResponse } from "next/server";
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { DomainService } from '@/lib/services/DomainService';

/**
 * GET /api/domains?teamId=...
 * List all domains for the given team
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
    console.log('teamId', teamId)
    const domains = await DomainService.getDomainsByTeam(teamId);
    return NextResponse.json({ domains });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}

/**
 * POST /api/domains
 * Create a new domain for the given team
 * Body: { teamId, domain }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { teamId, domain } = body;
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  if (!domain || typeof domain !== 'string') {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }
  try {
    const created = await DomainService.createDomain(domain, teamId, user.id);
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });
  }
}

/**
 * DELETE /api/domains
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
    return NextResponse.json({ error: "Domain ID is required" }, { status: 400 });
  }
  try {
    await DomainService.deleteDomain(id, teamId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting domain:", error);
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 });
  }
} 