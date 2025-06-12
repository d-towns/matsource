"use client"

import { usePartnerLogo } from '@/hooks/usePartnerLogo'
import { config } from '@/lib/config'
import Image from 'next/image'


interface PartnerLogoProps {
  bucket: string
  assetId: string
  className?: string
}

export  function PartnerLogo({ className = '' }: PartnerLogoProps) {
  const { logoUrl, loading, error } = usePartnerLogo()


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

  if (error || !logoUrl) {
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