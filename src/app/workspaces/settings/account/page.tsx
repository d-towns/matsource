import { Metadata } from "next"
import { Key } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Account Settings | BlueAgent",
  description: "Manage your BlueAgent account information",
}

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account details and preferences.
        </p>
      </div>
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Create and manage API keys for integrating with the BlueAgent Widget.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              API keys are used to authenticate requests to the BlueAgent widget service. 
              They allow you to securely embed lead capture forms on your website.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/workspaces/settings/account/api-keys">
                <Key className="h-4 w-4 mr-2" />
                Manage API Keys
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Add more sections for account settings here */}
      </div>
    </div>
  )
} 