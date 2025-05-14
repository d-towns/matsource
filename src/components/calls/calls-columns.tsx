"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  PhoneIcon,
  PhoneOffIcon,
  PhoneOutgoingIcon,
  VoicemailIcon,
  CalendarIcon,
  ClockIcon,
  XCircleIcon
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, parseISO, format } from "date-fns"
import { CallAttempt } from "@/lib/models/callAttempt"
import React from "react"
import { CallAttemptWithLead } from "@/lib/models/lead-callAttempt-shared"

// Helper function to format duration in mm:ss
function formatDuration(seconds?: number): string {
  if (!seconds) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper function to render outcome badge
function getStatusBadge(status?: string) {
  const statusConfig: Record<string, { class: string, icon: React.ReactNode }> = {
    connected: { 
      class: "bg-green-100 text-green-800 border-green-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    voicemail: { 
      class: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: <VoicemailIcon className="h-3 w-3 mr-1" /> 
    },
    no_answer: { 
      class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: <PhoneOffIcon className="h-3 w-3 mr-1" /> 
    },
    busy: { 
      class: "bg-orange-100 text-orange-800 border-orange-200", 
      icon: <PhoneOffIcon className="h-3 w-3 mr-1" /> 
    },
    failed: { 
      class: "bg-red-100 text-red-800 border-red-200", 
      icon: <XCircleIcon className="h-3 w-3 mr-1" /> 
    },
    appointment_scheduled: { 
      class: "bg-green-100 text-green-800 border-green-200", 
      icon: <CalendarIcon className="h-3 w-3 mr-1" /> 
    },
    declined: { 
      class: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: <XCircleIcon className="h-3 w-3 mr-1" /> 
    },
    follow_up: { 
      class: "bg-purple-100 text-purple-800 border-purple-200", 
      icon: <ClockIcon className="h-3 w-3 mr-1" /> 
    },
  }

  if (!status) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
        <PhoneOutgoingIcon className="h-3 w-3 mr-1" /> In Progress
      </Badge>
    )
  }

  const config = statusConfig[status] || { 
    class: "bg-gray-100 text-gray-600 border-gray-200", 
    icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
  }
  
  return (
    <Badge variant="outline" className={config.class}>
      {config.icon} {status.replace('_', ' ')}
    </Badge>
  )
}

export const columns: ColumnDef<CallAttemptWithLead>[] = [
  {
    accessorKey: "leads.name",
    header: "Lead",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Link 
            href={`/workspaces/leads/${row.original.lead_id}`}
            className="hover:underline text-blue-600 flex items-center"
          >
            {row.original.leads.name}
          </Link>
        </div>
      )
    }
  },
  {
    accessorKey: "leads.phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.leads.phone
      
      return (
        <div className="flex items-center">
          <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{phone}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined
      return getStatusBadge(status)
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number | undefined
      
      return (
        <div className="flex items-center">
          <ClockIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{formatDuration(duration)}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "started_at",
    header: "Call Time",
    cell: ({ row }) => {
      const startedAt = row.getValue("started_at") as string | undefined | null
      
      if (!startedAt) {
        const scheduledTime = row.original.start_time
        
        if (scheduledTime) {
          return (
            <span className="text-sm text-purple-600">
              Scheduled for {format(parseISO(scheduledTime), 'MMM d, h:mm a')}
            </span>
          )
        }
        
        return <span className="text-muted-foreground text-sm">Not started</span>
      }
      
      return (
        <span className="text-sm">
          {format(parseISO(startedAt), 'MMM d, h:mm a')}
        </span>
      )
    }
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string
      
      return (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}
        </span>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link
          href={`/workspaces/calls/${row.original.id}`}
          className="flex items-center"
        >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )
    }
  }
] 