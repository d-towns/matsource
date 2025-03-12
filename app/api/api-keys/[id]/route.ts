import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client directly
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * DELETE /api/api-keys/:id
 * Revoke an API key by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication via session cookie
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "API key ID is required" }, { status: 400 })
  }

  // First, verify that the API key belongs to the current user
  const { data: keyData, error: keyError } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("id", id)
    .single()

  if (keyError || !keyData) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 })
  }

  if (keyData.user_id !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Delete the API key
  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 