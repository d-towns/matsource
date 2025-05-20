import { NextRequest, NextResponse } from "next/server";
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { AgentService } from '@/lib/services/AgentService';

/**
 * GET /api/agents?teamId=...
 * List all agents for the given team
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
    const agents = await AgentService.getAgents(teamId);
    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

/**
 * POST /api/agents
 * Create a new agent for the given team
 * Body: { teamId, ... }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { teamId, ...agentData } = body;
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  try {
    const created = await AgentService.createAgent(user.id, teamId, agentData);
    return NextResponse.json(created);
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

/**
 * PATCH /api/agents
 * Update an agent for the given team
 * Body: { teamId, id, updates }
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { teamId, id, updates } = body;
  if (!teamId) {
    return NextResponse.json({ error: "teamId is required" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
  }
  try {
    const updated = await AgentService.updateAgent(id, teamId, updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

/**
 * DELETE /api/agents
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
    return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
  }
  try {
    await AgentService.deleteAgent(id, teamId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
} 