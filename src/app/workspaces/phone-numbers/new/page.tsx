'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCreatePhoneNumber } from '@/hooks/usePhoneNumbers'
import { useTeam } from '@/context/team-context'
import { toast } from "sonner"

export default function NewPhoneNumberPage() {
  const router = useRouter()
  const { activeTeam } = useTeam()
  const createMutation = useCreatePhoneNumber(activeTeam?.id)
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [friendlyName, setFriendlyName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!activeTeam?.id) {
      toast.error('No team selected')
      return
    }

    if (!phoneNumber || !friendlyName) {
      toast.error('Please fill in all fields')
      return
    }

    // Ensure phone number starts with +
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`

    try {
      const result = await createMutation.mutateAsync({
        phoneNumber: formattedPhoneNumber,
        friendlyName,
      })
      
      toast.success('Phone number verification started! You should receive a call shortly.')
      router.push(`/workspaces/phone-numbers/${result.id}`)
    } catch {
      toast.error('Failed to start verification. Please try again.')
    }
  }

  if (!activeTeam?.id) {
    return <div className="text-muted-foreground font-sans">No team selected.</div>
  }

  return (
    <div className="container mx-auto py-4 font-sans max-w-2xl">
      <div className="mb-6">
        <Link 
          href="/workspaces/phone-numbers" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Phone Numbers
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <PhoneIcon className="mr-2 h-6 w-6" />
          Add Phone Number
        </h1>
        <p className="text-muted-foreground mt-1 font-normal">
          Add and verify a new phone number for caller ID
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phone Number Details</CardTitle>
          <CardDescription>
            Enter your phone number details. You&apos;ll receive a verification call with a code to confirm ownership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Include country code (e.g., +1 for US/Canada)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="friendlyName">Friendly Name</Label>
              <Input
                id="friendlyName"
                type="text"
                placeholder="Business Main Line"
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                A name to help you identify this phone number
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? 'Starting Verification...' : 'Start Verification'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 