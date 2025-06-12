'use server'

import { createSupabaseSSRClient } from '@/lib/supabase/ssr'
import { headers } from 'next/headers'
import { getPartnerByDomain } from '../services/PartnerService'

export async function getPartnerLogoUrl(): Promise<string | null> {
  try {
    const headersList = await headers()
    const host = headersList.get('Host') || ''
    
    // Extract domain from host (remove port if present)
    const partner = await getPartnerByDomain(host)
    
    // You can customize this logic based on how you determine the partner
    // For now, using domain as the asset ID, but you could also:
    // 1. Query your database to get partner info by domain
    // 2. Use environment variables
    // 3. Use subdomain extraction logic
    
    const supabase = await createSupabaseSSRClient()
    
    // Try to get logo using domain as asset ID
    const filePath = `${partner.id}.png`
    console.log('filePath', filePath)
    const { data } = supabase.storage.from('partner-logos').getPublicUrl(filePath)
    console.log("data", data)
    
    if (!data?.publicUrl) {
      return null
    }

    // Optionally, you could verify the image exists by making a HEAD request
    // but for performance, we'll just return the URL
    return data.publicUrl
    
  } catch (error) {
    console.error('Error fetching partner logo:', error)
    return null
  }
} 