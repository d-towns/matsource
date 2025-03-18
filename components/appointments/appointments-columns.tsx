"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Appointment } from "@/lib/models/appointments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Calendar, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import Link from "next/link"

// Status badge configuration
const statusConfig: Record<string, { class: string, icon: React.ReactNode }> = {
  scheduled: { 
    class: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: <Calendar className="h-3 w-3 mr-1" /> 
  },
  confirmed: { 
    class: "bg-purple-100 text-purple-800 border-purple-200", 
    icon: <CheckCircle className="h-3 w-3 mr-1" /> 
  },
  completed: { 
    class: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircle className="h-3 w-3 mr-1" /> 
  },
  cancelled: { 
    class: "bg-red-100 text-red-800 border-red-200", 
    icon: <XCircle className="h-3 w-3 mr-1" /> 
  },
  no_show: { 
    class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: <AlertCircle className="h-3 w-3 mr-1" /> 
  }
}

export const columns: ColumnDef<Appointment>[] = [
  // Lead name column (with link to lead detail)
  {
    accessorKey: "lead",
    header: "Lead",
    cell: ({ row }) => {
      const lead = row.original.lead
      
      return (
        <Link 
          href={`/workspaces/leads/${lead.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {lead.name}
        </Link>
      )
    },
  },
  
  // Date column
  {
    accessorKey: "scheduled_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const scheduled = row.original.scheduled_time
      return format(parseISO(scheduled), "MMM d, yyyy")
    },
  },
  
  // Time column
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const scheduled = row.original.scheduled_time
      return format(parseISO(scheduled), "h:mm a")
    },
  },
  
  // Duration column
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.original.duration
      return `${duration} mins`
    },
  },
  
  // Status column
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const config = statusConfig[status] || statusConfig.scheduled
      
      return (
        <Badge variant="outline" className={config.class}>
          {config.icon} {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  
  // Created column
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const created = row.original.created_at
      return format(parseISO(created), "MMM d, yyyy")
    },
  },
  
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id
      
      return (
        <Link href={`/workspaces/appointments/${id}`}>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </Link>
      )
    },
  },
] 