"use client"

import { useState } from "react"
import { toast as sonnerToast, ToastT } from "sonner"

type ToastProps = {
  title: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

export function useToast() {
  function toast({ title, description, duration = 5000, variant = "default" }: ToastProps) {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        duration,
      })
    }
    
    return sonnerToast(title, {
      description,
      duration,
    })
  }

  return { toast }
} 