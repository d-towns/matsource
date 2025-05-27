"use client";

import { TeamProvider } from "@/context/team-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Don't refetch on window focus
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data exists and is not stale
      refetchOnMount: false,
      // Don't refetch on reconnect
      refetchOnReconnect: false,
      // Retry failed requests only once
      retry: 1,
      // Retry delay
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TeamProvider>
          {children}
        </TeamProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
} 