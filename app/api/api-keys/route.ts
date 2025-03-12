import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

// Create a Supabase client directly (no cookie handling needed for API routes)

/**
 * GET /api/api-keys
 * List all API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  // Check authentication via session cookie
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  console.log("user", user)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get all API keys for the current user (excluding the actual keys which are hashed)
  const { data: keys, error } = await supabase
    .from("api_keys")
    .select("id, name, created_at, last_used_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }

  return NextResponse.json({ keys })
}

/**
 * POST /api/api-keys
 * Create a new API key for the authenticated user
 */
export async function POST(request: NextRequest) {
  // Check authentication via session cookie
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Parse request body
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate API key
    const apiKey = `mk_${crypto.randomBytes(24).toString("hex")}`
    
    // Hash the API key for storage (we only want to store a hash, not the actual key)
    const hashedKey = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex")

    // Create a new API key record
    const { data: key, error } = await supabase
      .from("api_keys")
      .insert({
        id: uuidv4(),
        user_id: user.id,
        name,
        key: hashedKey,
      })
      .select("id, name")
      .single()

    if (error) {
      console.error("Error creating API key:", error)
      return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
    }

    // Return the API key (this is the only time the API key will be visible to the user)
    return NextResponse.json({
      id: key.id,
      name: key.name,
      key: apiKey,
    })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
} 