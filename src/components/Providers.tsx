"use client";

import { TeamProvider } from "@/context/team-context";
import { useUser } from "@/hooks/use-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import React from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const {user} = useUser()
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TeamProvider userId={user?.id}>
          {children}
        </TeamProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
} 