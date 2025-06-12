import { useState, useEffect } from 'react'
import { useUser } from './use-user'

interface PartnerLogoData {
  url: string
  bucket: string
  assetId: string
  filePath: string
}

interface UsePartnerLogoResult {
  logoUrl: string | null
  loading: boolean
  error: string | null
}

export function usePartnerLogo(): UsePartnerLogoResult {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { partnerId } = useUser()
  useEffect(() => {
    if (!partnerId) {
      setLoading(false)
      return
    }

    const fetchLogo = async () => {
      try {
        setLoading(true)
        setError(null)
        const assetId = partnerId + '.png'
        const response = await fetch(`/api/images?bucket=partner-logos&assetId=${encodeURIComponent(assetId)}`)
        
        if (!response.ok) { 
          throw new Error(`Failed to fetch logo: ${response.statusText}`)
        }

        const data: PartnerLogoData = await response.json()
        setLogoUrl(data.url)
      } catch (err) {
        console.error('Error fetching partner logo:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch logo')
      } finally {
        setLoading(false)
      }
    }

    fetchLogo()
  }, [partnerId])

  return { logoUrl, loading, error }
} 