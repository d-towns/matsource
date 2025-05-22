'use client'

import { ReactNode, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('account')

  // Determine active tab based on current path
  useEffect(() => {
    if (pathname.includes('/billing')) {
      setActiveTab('billing')
    } else if (pathname.includes('/api-keys')) {
      setActiveTab('api-keys')
    } else if (pathname.includes('/notifications')) {
      setActiveTab('notifications')
    } else {
      setActiveTab('account')
    }
  }, [pathname])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // Navigate to the appropriate route
    switch (value) {
      case 'account':
        router.push('/workspaces/settings/account')
        break
      case 'api-keys':
        router.push('/workspaces/settings/account/api-keys')
        break
      case 'billing':
        router.push('/workspaces/settings/billing')
        break
      case 'notifications':
        router.push('/workspaces/settings/notifications')
        break
    }
  }

  return (
    <div className="container py-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-sans">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account" className="font-sans">Account</TabsTrigger>
          <TabsTrigger value="api-keys" className="font-sans">API Keys</TabsTrigger>
          <TabsTrigger value="billing" className="font-sans">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="font-sans">Notifications</TabsTrigger>
        </TabsList>
        
        {/* Account Tab */}
        <TabsContent value="account">
          {activeTab === 'account' && children}
        </TabsContent>
        
        {/* API Keys Tab */}
        <TabsContent value="api-keys">
          {activeTab === 'api-keys' && children}
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing">
          {activeTab === 'billing' && children}
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          {activeTab === 'notifications' && children}
        </TabsContent>
      </Tabs>
    </div>
  )
} 