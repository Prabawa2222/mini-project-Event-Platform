"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Home,
  LogOut,
  Menu,
  Settings,
  Ticket,
  User,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const ORGANIZER_ITEMS = [
  {
    title: "Home",
    url: "/organizer/dashboard",
    icon: Home,
  },
  {
    title: "Event",
    url: "/organizer/dashboard/events",
    icon: Ticket,
  },
  {
    title: "Transactions",
    url: "/organizer/dashboard/transactions",
    icon: DollarSign,
  },
  {
    title: "Profile",
    url: "/organizer/profile",
    icon: User,
  },
];

const CUSTOMER_ITEMS = [
  {
    title: "Transactions",
    url: "/customer/transactions",
    icon: DollarSign,
  },
  {
    title: "Profile",
    url: "/customer/profile",
    icon: User,
  },
];

export function DashboardSidebar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "CUSTOMER";
  const userName =
    session?.user?.name ||
    (userRole === "ORGANIZER" ? "Organizer" : "Customer");

  const items = userRole === "ORGANIZER" ? ORGANIZER_ITEMS : CUSTOMER_ITEMS;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl">{userName}</SidebarGroupLabel>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t pb-10">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 justify-start px-4 py-2 text-slate-600 hover:text-slate-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
