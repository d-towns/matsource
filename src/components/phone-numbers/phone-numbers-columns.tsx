"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PhoneNumber } from "@/lib/models/phone_number"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CheckCircle, Clock, XCircle, MoreHorizontal, RotateCcw, Trash2, Phone, ShoppingCart } from "lucide-react"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRetryVerification, useDeletePhoneNumber } from "@/hooks/usePhoneNumbers"
import { useTeam } from "@/context/team-context"
import { useState } from "react"

// Status badge configuration
const statusConfig: Record<string, { class: string, icon: React.ReactNode }> = {
  pending: { 
    class: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: <Clock className="h-3 w-3 mr-1" /> 
  },
  success: { 
    class: "bg-green-100 text-green-800 border-green-200", 
    icon: <CheckCircle className="h-3 w-3 mr-1" /> 
  },
  failed: { 
    class: "bg-red-100 text-red-800 border-red-200", 
    icon: <XCircle className="h-3 w-3 mr-1" /> 
  }
}

// Phone number type configuration
const typeConfig: Record<string, { class: string, icon: React.ReactNode, label: string }> = {
  verified_caller_id: {
    class: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <Phone className="h-3 w-3 mr-1" />,
    label: "Verified Caller ID"
  },
  twilio_purchased: {
    class: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <ShoppingCart className="h-3 w-3 mr-1" />,
    label: "Twilio Number"
  }
}

function ActionsCell({ phoneNumber }: { phoneNumber: PhoneNumber }) {
  const { activeTeam } = useTeam()
  const retryMutation = useRetryVerification(activeTeam?.id)
  const deleteMutation = useDeletePhoneNumber(activeTeam?.id)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRetry = () => {
    if (activeTeam?.id) {
      retryMutation.mutate(phoneNumber.id)
    }
  }

  const handleDelete = () => {
    if (activeTeam?.id) {
      deleteMutation.mutate(phoneNumber.id)
      setShowDeleteDialog(false)
    }
  }

  const canDelete = phoneNumber.phone_number_type === 'verified_caller_id'
  const canRetry = phoneNumber.phone_number_type === 'verified_caller_id' && phoneNumber.verification_status === 'failed'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/workspaces/phone-numbers/${phoneNumber.id}`}>
              View Details
            </Link>
          </DropdownMenuItem>
          {canRetry && (
            <DropdownMenuItem onClick={handleRetry} disabled={retryMutation.isPending}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Verification
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the phone number {phoneNumber.phone_number}. 
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
    </>
  )
}

export const columns: ColumnDef<PhoneNumber>[] = [
  // Phone number column
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const phoneNumber = row.original.phone_number
      return (
        <Link 
          href={`/workspaces/phone-numbers/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {phoneNumber}
        </Link>
      )
    },
  },
  
  // Friendly name column
  {
    accessorKey: "friendly_name",
    header: "Name",
    cell: ({ row }) => {
      const friendlyName = row.original.friendly_name
      return friendlyName || <span className="text-muted-foreground">—</span>
    },
  },

  // Type column
  {
    accessorKey: "phone_number_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.phone_number_type || 'verified_caller_id'
      const config = typeConfig[type] || typeConfig.verified_caller_id
      
      return (
        <Badge variant="outline" className={config.class}>
          {config.icon} {config.label}
        </Badge>
      )
    },
  },
  
  // Status column
  {
    accessorKey: "verification_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.verification_status
      const config = statusConfig[status] || statusConfig.pending
      
      return (
        <Badge variant="outline" className={config.class}>
          {config.icon} {status}
        </Badge>
      )
    },
  },
  
  // Created column
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const created = row.original.created_at
      return format(parseISO(created), "MMM d, yyyy")
    },
  },
  
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell phoneNumber={row.original} />,
  },
] 