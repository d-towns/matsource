"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { IntegrationState } from "@/lib/models/integrations"
import { format } from "date-fns"

export function GoogleCalendarCard() {
  const [loading, setLoading] = useState<boolean>(true)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [disconnecting, setDisconnecting] = useState<boolean>(false)
  const [integrationState, setIntegrationState] = useState<IntegrationState>({ isConnected: false })
  const [alert, setAlert] = useState<{ type: 'error' | 'success', message: string } | null>(null)

  // Fetch integration status on component mount
  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true)
        const response = await fetch('/api/integrations/google/status')
        
        if (!response.ok) {
          throw new Error('Failed to fetch integration status')
        }
        
        const data = await response.json()
        setIntegrationState(data)
      } catch (error) {
        console.error('Error checking integration status:', error)
        setAlert({
          type: 'error',
          message: 'Failed to check integration status'
        })
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  // Connect to Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      setConnecting(true)
      const response = await fetch('/api/integrations/google/auth', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to initiate Google Calendar authentication')
      }
      
      const { authUrl } = await response.json()
      window.location.href = authUrl
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
      setAlert({
        type: 'error',
        message: 'Failed to connect to Google Calendar'
      })
      setConnecting(false)
    }
  }

  // Disconnect from Google Calendar
  const disconnectGoogleCalendar = async () => {
    try {
      setDisconnecting(true)
      const response = await fetch('/api/integrations/google/disconnect', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to disconnect Google Calendar')
      }
      
      setIntegrationState({ isConnected: false })
      setAlert({
        type: 'success',
        message: 'Google Calendar disconnected successfully'
      })
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error)
      setAlert({
        type: 'error',
        message: 'Failed to disconnect Google Calendar'
      })
    } finally {
      setDisconnecting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl">Google Calendar</CardTitle>
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
        <CardDescription className="text-sm text-muted-foreground">
          Connect your Google Calendar to allow appointment scheduling for your leads.
        </CardDescription>

        {integrationState.isConnected && integrationState.lastSynced && (
          <p className="text-xs text-muted-foreground mt-2">
            Last synced: {format(new Date(integrationState.lastSynced), 'PPpp')}
          </p>
        )}

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

        {alert && (
          <div className="mt-3">
            <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className={alert.type === 'success' ? 'border-green-500 text-green-800' : ''}>
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
            onClick={disconnectGoogleCalendar}
            disabled={disconnecting}
          >
            {disconnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={connectGoogleCalendar}
            disabled={connecting}
          >
            {connecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 