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
import { Home, Menu, Settings, Ticket, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const items = [
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
    icon: Ticket,
  },
  {
    title: "Profile",
    url: "/organizer/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/organizer/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const { data: session } = useSession();
  const organizeName = session?.user?.name || "Organizer";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{organizeName}</SidebarGroupLabel>
          <SidebarGroupContent>
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
    </Sidebar>
  );
}

function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
