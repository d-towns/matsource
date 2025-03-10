"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"
import { LeadWithCallCount } from "@/lib/models/leads"
import React from "react"

// Helper function to render status badge
function getStatusBadge(status: string) {
  const statusConfig: Record<string, { class: string, icon: React.ReactNode }> = {
    new: { 
      class: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: <Clock className="h-3 w-3 mr-1" /> 
    },
    contacted: { 
      class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: <PhoneIcon className="h-3 w-3 mr-1" /> 
    },
    in_progress: { 
      class: "bg-purple-100 text-purple-800 border-purple-200", 
      icon: <Clock className="h-3 w-3 mr-1" /> 
    },
    appointment_scheduled: { 
      class: "bg-green-100 text-green-800 border-green-200", 
      icon: <CalendarIcon className="h-3 w-3 mr-1" /> 
    },
    qualified: { 
      class: "bg-teal-100 text-teal-800 border-teal-200", 
      icon: <CheckCircle className="h-3 w-3 mr-1" /> 
    },
    unqualified: { 
      class: "bg-gray-100 text-gray-800 border-gray-200", 
      icon: <XCircle className="h-3 w-3 mr-1" /> 
    },
    closed: { 
      class: "bg-green-500 text-white border-green-600", 
      icon: <CheckCircle className="h-3 w-3 mr-1" /> 
    },
  }

  const config = statusConfig[status] || statusConfig.new
  
  return (
    <Badge variant="outline" className={config.class}>
      {config.icon} {status.replace('_', ' ')}
    </Badge>
  )
}

export const columns: ColumnDef<LeadWithCallCount>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Link 
            href={`/workspaces/leads/${row.original.id}`}
            className="hover:underline text-blue-600 flex items-center"
          >
            {row.getValue("name")}
          </Link>
        </div>
      )
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      
      return (
        <div className="flex items-center">
          <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span>{phone}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null
      
      if (!email) return <span className="text-muted-foreground text-sm">—</span>
      
      return (
        <div className="flex items-center">
          <MailIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{email}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return getStatusBadge(status)
    }
  },
  {
    accessorKey: "call_count",
    header: "Calls",
    cell: ({ row }) => {
      const callCount = row.getValue("call_count") as number
      return (
        <Badge variant="outline" className="bg-gray-100 border-gray-200">
          <PhoneIcon className="h-3 w-3 mr-1" /> {callCount}
        </Badge>
      )
    }
  },
  {
    accessorKey: "last_call_date",
    header: "Last Contact",
    cell: ({ row }) => {
      const lastCallDate = row.getValue("last_call_date") as string | undefined
      
      if (!lastCallDate) return <span className="text-muted-foreground text-sm">Never contacted</span>
      
      return (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(parseISO(lastCallDate), { addSuffix: true })}
        </span>
      )
    }
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(parseISO(row.getValue("created_at")), { addSuffix: true })}
        </span>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Link
          href={`/workspaces/leads/${row.original.id}`}
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