import { createSupabaseSSRClient } from '@/lib/supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket')
    const assetId = searchParams.get('assetId')

    if (!bucket || !assetId) {
      return NextResponse.json(
        { error: 'Missing required parameters: bucket and assetId' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseSSRClient()
    
    // Construct the file path with .png extension
    const filePath = `${assetId}.png`
    
    // Get the public URL for the image
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    
    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL for image' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      url: data.publicUrl,
      bucket,
      assetId,
      filePath
    })

  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 