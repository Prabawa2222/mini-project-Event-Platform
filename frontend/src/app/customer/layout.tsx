"use client";

import { DashboardSidebar } from "@/components/ui/dashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/user/UserContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <SidebarProvider>
            <DashboardSidebar />
            <main className="flex-1">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </UserProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
