'use client'
import React, { Suspense } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/leads/leads-columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UsersIcon } from 'lucide-react'
import { Lead } from '@/lib/models/lead'
import { useTeam } from '@/context/team-context'

function LeadsTable({ teamId }: { teamId: string }) {
  const { data: leads, error } = useLeads(teamId, true)
  if (error) return <p className="text-destructive font-sans">Error loading leads: {error.message}</p>
  return <DataTable columns={columns} data={(leads || []) as Lead[]} />
}

function LeadsSkeleton() {
  return (
    <div className="h-40 w-full bg-muted rounded animate-pulse my-8" />
  )
}

export default function LeadsPage() {
  const { activeTeam } = useTeam()
  if (!activeTeam?.id) {
    return <div className="text-muted-foreground font-sans">No team selected.</div>
  }
  return (
    <div className="container mx-auto py-4 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <UsersIcon className="mr-2 h-6 w-6" />
          Leads Management
        </h1>
        <p className="text-muted-foreground mt-1 font-normal">
          View and manage all your leads and track their progress
        </p>
      </div>
      <div className="flex justify-end mb-4">
        <Link href="/workspaces/leads/new">
          <Button>Add Lead</Button>
        </Link>
      </div>
      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsTable teamId={activeTeam.id} />
      </Suspense>
    </div>
  )
} 