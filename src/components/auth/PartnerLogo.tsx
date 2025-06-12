"use client"

import { getPartnerLogoUrl } from '@/lib/actions/partner-logo'
import { config } from '@/lib/config'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface PartnerLogoProps {
  className?: string
}

export function PartnerLogo({ className = '' }: PartnerLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = await getPartnerLogoUrl()
        setLogoUrl(url)
      } catch (error) {
        console.error('Error fetching partner logo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogo()
  }, [])

  // Only show if white label is enabled
  if (!config.env.isWhiteLabel) {
    return null
  }

  if (loading) {
    return (
      <div className={`flex justify-center mb-6 ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded-lg h-16 w-32"></div>
      </div>
    )
  }

  if (!logoUrl) {
    return null
  }

  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <Image
        src={logoUrl}
        alt="Partner Logo"
        width={128}
        height={64}
        className="max-h-16 w-auto object-contain"
        priority
      />
    </div>
  )
} 