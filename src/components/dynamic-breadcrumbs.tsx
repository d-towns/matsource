'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Settings, CreditCard, Bell, BadgeCheck, Key, Phone, Users, Zap, Globe } from 'lucide-react'

interface BreadcrumbConfig {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

const pathConfig: Record<string, BreadcrumbConfig> = {
  '/workspaces/dashboard': { label: 'Dashboard', href: '/workspaces/dashboard', icon: Home },
  '/workspaces/leads': { label: 'Leads', href: '/workspaces/leads', icon: Users },
  '/workspaces/calls': { label: 'Calls', href: '/workspaces/calls', icon: Phone },
  '/workspaces/integrations': { label: 'Integrations', href: '/workspaces/integrations', icon: Zap },
  '/workspaces/integrations/embed': { label: 'Website Integration', href: '/workspaces/integrations/embed', icon: Globe },
  '/workspaces/settings': { label: 'Settings', href: '/workspaces/settings', icon: Settings },
  '/workspaces/settings/account': { label: 'Account', href: '/workspaces/settings/account', icon: BadgeCheck },
  '/workspaces/settings/account/api-keys': { label: 'API Keys', href: '/workspaces/settings/account/api-keys', icon: Key },
  '/workspaces/settings/billing': { label: 'Billing', href: '/workspaces/settings/billing', icon: CreditCard },
  '/workspaces/settings/notifications': { label: 'Notifications', href: '/workspaces/settings/notifications', icon: Bell },
}

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  
  // Split pathname into segments and build breadcrumb trail
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbConfig[] = []
  
  // Build cumulative paths
  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const config = pathConfig[currentPath]
    
    if (config) {
      breadcrumbs.push(config)
    } else {
      // Fallback for unknown paths - capitalize and clean up the segment
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label, href: currentPath })
    }
  }
  
  // Don't show breadcrumbs for root workspace path
  if (breadcrumbs.length <= 1) {
    return null
  }
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          const Icon = crumb.icon
          
          return (
            <div key={crumb.href || crumb.label} className="flex items-center">
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1 font-sans">
                    {Icon && <Icon className="h-4 w-4" />}
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={crumb.href || '#'} 
                    className="flex items-center gap-1 font-sans"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
              )}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 