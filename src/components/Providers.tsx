"use client";

import { TeamProvider } from "@/context/team-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import React from "react";

const queryClient = new QueryClient();

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