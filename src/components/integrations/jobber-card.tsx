"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, CheckCircle, AlertCircle, Loader2, Users, FileText, DollarSign } from "lucide-react"
import { JobberIntegrationState } from "@/lib/models/integrations"
import { format } from "date-fns"

export function JobberCard() {
  const [loading, setLoading] = useState<boolean>(true)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [disconnecting, setDisconnecting] = useState<boolean>(false)
  const [integrationState, setIntegrationState] = useState<JobberIntegrationState>({ isConnected: false })
  const [alert, setAlert] = useState<{ type: 'error' | 'success', message: string } | null>(null)

  // Fetch integration status on component mount
  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true)
        const response = await fetch('/api/integrations/jobber/status')
        
        if (!response.ok) {
          throw new Error('Failed to fetch Jobber integration status')
        }
        
        const data = await response.json()
        setIntegrationState(data)
      } catch (error) {
        console.error('Error checking Jobber integration status:', error)
        setAlert({
          type: 'error',
          message: 'Failed to check Jobber integration status'
        })
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  // Handle URL parameters for success/error states
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const error = urlParams.get('error')

    if (success === 'jobber_connected') {
      setAlert({
        type: 'success',
        message: 'Jobber connected successfully! You can now sync your client data.'
      })
      // Refresh the integration state
      checkStatus()
    } else if (error) {
      const errorMessages: Record<string, string> = {
        'jobber_auth_denied': 'Jobber authorization was denied. Please try connecting again.',
        'jobber_auth_error': 'An error occurred during Jobber authorization. Please try again.',
        'invalid_callback': 'Invalid authorization response. Please try connecting again.',
        'token_exchange_failed': 'Failed to complete Jobber connection. Please try again.',
        'token_storage_failed': 'Failed to save Jobber connection. Please try again.',
        'no_active_team': 'No active team found. Please select a team and try again.',
        'network_error': 'Network error occurred. Please check your connection and try again.',
        'invalid_token_response': 'Invalid response from Jobber. Please try again.',
      }
      
      setAlert({
        type: 'error',
        message: errorMessages[error] || 'An unexpected error occurred. Please try again.'
      })
    }

    // Clean up URL parameters
    if (success || error) {
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  // Function to refresh status (used after successful connection)
  const checkStatus = async () => {
    try {
      const response = await fetch('/api/integrations/jobber/status')
      if (response.ok) {
        const data = await response.json()
        setIntegrationState(data)
      }
    } catch (error) {
      console.error('Error refreshing status:', error)
    }
  }

  // Connect to Jobber
  const connectJobber = async () => {
    try {
      setConnecting(true)
      setAlert(null)
      
      const response = await fetch('/api/integrations/jobber/auth', {
        method: 'POST'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to initiate Jobber authentication')
      }
      
      const { authUrl } = await response.json()
      
      // Redirect to Jobber authorization page
      window.location.href = authUrl
      
    } catch (error) {
      console.error('Error connecting to Jobber:', error)
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to connect to Jobber'
      })
      setConnecting(false)
    }
  }

  // Disconnect from Jobber
  const disconnectJobber = async () => {
    try {
      setDisconnecting(true)
      setAlert(null)
      
      const response = await fetch('/api/integrations/jobber/disconnect', {
        method: 'POST'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to disconnect Jobber')
      }
      
      setIntegrationState({ isConnected: false })
      setAlert({
        type: 'success',
        message: 'Jobber disconnected successfully'
      })
      
    } catch (error) {
      console.error('Error disconnecting Jobber:', error)
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to disconnect Jobber'
      })
    } finally {
      setDisconnecting(false)
    }
  }

  // Format expiration date
  const formatExpirationDate = (expiresAt: string) => {
    try {
      return format(new Date(expiresAt), 'PPpp')
    } catch {
      return 'Unknown'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Jobber</CardTitle>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : integrationState.isConnected ? (
            <Badge variant="default" className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              <AlertCircle className="h-3 w-3 mr-1" /> Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground mb-3">
          Connect your Jobber account to sync client information, job details, and invoicing data 
          for seamless appointment scheduling and customer management.
        </CardDescription>

        {/* Connection Details */}
        {integrationState.isConnected && (
          <div className="space-y-2 mb-3">
            {integrationState.lastSynced && (
              <p className="text-xs text-muted-foreground">
                Last synced: {format(new Date(integrationState.lastSynced), 'PPpp')}
              </p>
            )}
            
            {integrationState.expiresAt && (
              <p className="text-xs text-muted-foreground">
                Token expires: {formatExpirationDate(integrationState.expiresAt)}
              </p>
            )}
            
            {integrationState.scope && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Permissions:</span>
                <div className="flex gap-1">
                  {integrationState.scope.split(',').map((scope) => (
                    <Badge key={scope} variant="secondary" className="text-xs px-1 py-0">
                      {scope.replace('read_', '').replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features List */}
        {!integrationState.isConnected && (
          <div className="space-y-2 mb-3">
            <p className="text-sm font-medium text-muted-foreground">What you&rsquo;ll get:</p>
            <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>Sync client contact information</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                <span>Access job details and schedules</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3" />
                <span>View invoicing and payment data</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {integrationState.error && (
          <div className="mt-3">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {integrationState.error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Alert Messages */}
        {alert && (
          <div className="mt-3">
            <Alert 
              variant={alert.type === 'error' ? 'destructive' : 'default'} 
              className={alert.type === 'success' ? 'border-green-500 text-green-800 bg-green-50' : ''}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {alert.message}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {integrationState.isConnected ? (
          <Button
            variant="destructive"
            onClick={disconnectJobber}
            disabled={disconnecting}
          >
            {disconnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={connectJobber}
            disabled={connecting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {connecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Connect to Jobber
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 