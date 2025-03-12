import { ReactNode } from "react"
import { Metadata } from "next"
import { BadgeCheck, Key, CreditCard, Bell } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Settings | MatBot",
  description: "Manage your MatBot account settings",
}

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="border-r pr-6">
          <h2 className="font-semibold mb-4">Settings</h2>
          <nav className="space-y-1">
            <SettingsNavItem
              href="/workspaces/settings/account"
              icon={BadgeCheck}
              label="Account"
            />
            <SettingsNavItem
              href="/workspaces/settings/account/api-keys"
              icon={Key}
              label="API Keys"
              className="pl-8"
            />
            <SettingsNavItem 
              href="/workspaces/settings/billing" 
              icon={CreditCard} 
              label="Billing" 
            />
            <SettingsNavItem 
              href="/workspaces/settings/notifications" 
              icon={Bell} 
              label="Notifications" 
            />
          </nav>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

interface SettingsNavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  className?: string
}

function SettingsNavItem({ href, icon: Icon, label, className }: SettingsNavItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
} 