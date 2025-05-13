'use client'
import React from 'react'
import { useLeads } from '@/hooks/useLeads'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/leads/leads-columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { UsersIcon } from 'lucide-react'
import { LeadWithCallCount } from '@/lib/models/leads'

export default function LeadsPage() {
  const { data: leads, isLoading, error } = useLeads()

  if (isLoading) return <LoadingSpinner text="Loading leads..." fullPage />
  if (error) return <p>Error loading leads: {error.message}</p>

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UsersIcon className="mr-2 h-6 w-6" />
          Leads Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your leads and track their progress
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <Link href="/workspaces/leads/new">
          <Button>Add Lead</Button>
        </Link>
      </div>

      <DataTable columns={columns} data={(leads || []) as LeadWithCallCount[]} />
    </div>
  )
} 