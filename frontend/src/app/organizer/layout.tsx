"use client";

import { DashboardSidebar } from "@/components/ui/dashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizerProvider } from "@/context/organizer/OrganizerContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";

const queryClient = new QueryClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <OrganizerProvider>
          <SidebarProvider>
            <DashboardSidebar />
            <main className="flex-1">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </OrganizerProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
