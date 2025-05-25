'use client'
import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PhoneIcon, ArrowLeft, CheckCircle, Clock, XCircle, RotateCcw, Trash2 } from "lucide-react"
import Link from "next/link"
import { usePhoneNumber, useRetryVerification, useDeletePhoneNumber } from '@/hooks/usePhoneNumbers'
import { useTeam } from '@/context/team-context'
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const statusConfig = {
  pending: { 
    class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: <Clock className="h-4 w-4 mr-2" />,
    title: "Verification Pending",
    description: "Waiting for you to answer the verification call and enter the code."
  },
  success: { 
    class: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircle className="h-4 w-4 mr-2" />,
    title: "Verified Successfully",
    description: "This phone number is verified and ready to use as caller ID."
  },
  failed: { 
    class: "bg-red-100 text-red-800 border-red-200", 
    icon: <XCircle className="h-4 w-4 mr-2" />,
    title: "Verification Failed",
    description: "The verification call was not completed successfully. You can retry the verification."
  }
}

export default function PhoneNumberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { activeTeam } = useTeam()
  const { id } = use(params)
  const { data: phoneNumber, isLoading } = usePhoneNumber(id, activeTeam?.id)
  const retryMutation = useRetryVerification(activeTeam?.id)
  const deleteMutation = useDeletePhoneNumber(activeTeam?.id)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRetry = async () => {
    if (!activeTeam?.id) return
    
    try {
      await retryMutation.mutateAsync(id)
      toast.success('Verification restarted! You should receive a call shortly.')
    } catch {
      toast.error('Failed to retry verification. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (!activeTeam?.id) return
    
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Phone number deleted successfully.')
      router.push('/workspaces/phone-numbers')
    } catch {
      toast.error('Failed to delete phone number. Please try again.')
    }
  }

  if (!activeTeam?.id) {
    return <div className="text-muted-foreground font-sans">No team selected.</div>
  }

  if (isLoading) {
    return <div className="container mx-auto py-4 font-sans max-w-2xl">
      <div className="h-40 w-full bg-muted rounded animate-pulse" />
    </div>
  }

  if (!phoneNumber) {
    return <div className="container mx-auto py-4 font-sans max-w-2xl">
      <p className="text-destructive font-sans">Error loading phone number details</p>
    </div>
  }

  const config = statusConfig[phoneNumber.status] || statusConfig.pending

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
          Phone Number Details
        </h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Verification Status</span>
              <Badge variant="outline" className={config.class}>
                {config.icon} {phoneNumber.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              {config.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Phone Number</h3>
              <p className="text-lg font-mono">{phoneNumber.phoneNumber}</p>
            </div>
            
            {phoneNumber.friendlyName && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Friendly Name</h3>
                <p className="text-lg">{phoneNumber.friendlyName}</p>
              </div>
            )}
            
            {phoneNumber.validationCode && phoneNumber.status === 'pending' && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Validation Code</h3>
                <p className="text-lg font-mono bg-muted p-2 rounded">
                  {phoneNumber.validationCode}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter this code when you receive the verification call
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Manage this phone number verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {phoneNumber.status === 'failed' && (
                <Button 
                  onClick={handleRetry}
                  disabled={retryMutation.isPending}
                  className="flex items-center"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {retryMutation.isPending ? 'Retrying...' : 'Retry Verification'}
                </Button>
              )}
              
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteMutation.isPending}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this phone number verification. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 