'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, CreditCard, Calendar, Users, Clock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BillingInfo {
  team_name: string
  has_subscription: boolean
  user_role: string
  can_manage_billing: boolean
  message?: string
  subscription?: {
    id: string
    status: string
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
    canceled_at: string | null
    trial_start: string | null
    trial_end: string | null
    quantity: number
    concurrency_max: number
    current_period_pool_minutes_usage: number
  }
  price?: {
    amount: number
    currency: string
    interval: string
    interval_count: number
    product_name: string
    product_description: string
  }
  customer?: {
    email: string
    name: string
    default_payment_method: string
  }
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetchBillingInfo()
  }, [])

  const fetchBillingInfo = async () => {
    try {
      const response = await fetch('/api/billing/info')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch billing information')
      }

      console.log('BILLING INFO', data)
      setBillingInfo(data)
    } catch (err) {
      console.log('ERROR', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal')
      setPortalLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: 'Active' },
      trialing: { variant: 'secondary' as const, label: 'Trial' },
      canceled: { variant: 'destructive' as const, label: 'Canceled' },
      incomplete: { variant: 'destructive' as const, label: 'Incomplete' },
      past_due: { variant: 'destructive' as const, label: 'Past Due' },
      unpaid: { variant: 'destructive' as const, label: 'Unpaid' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'secondary' as const, 
      label: status 
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return <BillingSkeleton />
  }

  if (error) {
    return (
      <div className="font-sans">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!billingInfo?.has_subscription) {
    return (
      <div className="font-sans">
        <div className="mb-6">
          <p className="text-muted-foreground font-sans">
            Manage your team's subscription and billing information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">No Active Subscription</CardTitle>
            <CardDescription className="font-sans">
              {billingInfo?.message || 'Your team does not have an active subscription.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="font-sans">
              <a href="/onboarding?step=plan_selection">Choose a Plan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { subscription, price, customer } = billingInfo

  return (
    <div className="space-y-6 font-sans">
      <div className="mb-6">
        <p className="text-muted-foreground font-sans">
          Manage your team's subscription and billing information for {billingInfo.team_name}
        </p>
      </div>

      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-sans">Current Subscription</CardTitle>
              <CardDescription className="font-sans">
                {price?.product_name || 'Subscription Plan'}
              </CardDescription>
            </div>
            {subscription && getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {price && (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-sans">
                {formatCurrency(price.amount, price.currency)}
                {price.interval_count > 1 ? ` every ${price.interval_count} ` : ' per '}
                {price.interval}
                {price.interval_count > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {subscription && (
            <>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-sans">
                  Current period: {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-sans">
                  Concurrency limit: {subscription.concurrency_max} concurrent calls
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-sans">
                  Pool minutes used this period: {subscription.current_period_pool_minutes_usage || 0}
                </span>
              </div>

              {subscription.cancel_at_period_end && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-sans">
                    Your subscription will be canceled at the end of the current billing period on {formatDate(subscription.current_period_end)}.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Billing Management */}
      {billingInfo.can_manage_billing && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Billing Management</CardTitle>
            <CardDescription className="font-sans">
              Update payment methods, view invoices, and manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={openCustomerPortal} 
              disabled={portalLoading}
              className="font-sans"
            >
              {portalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening Portal...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Customer Information */}
      {customer && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Billing Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customer.name && (
              <p className="font-sans"><strong>Name:</strong> {customer.name}</p>
            )}
            {customer.email && (
              <p className="font-sans"><strong>Email:</strong> {customer.email}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BillingSkeleton() {
  return (
    <div className="space-y-6 font-sans">
      <div className="mb-6">
        <Skeleton className="h-5 w-96 mb-2" />
      </div>

      {/* Subscription Overview Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-56" />
          </div>
        </CardContent>
      </Card>

      {/* Billing Management Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>

      {/* Customer Information Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>
    </div>
  )
} 