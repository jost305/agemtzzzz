"use client"

import type * as React from "react"
import {
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
  Store,
  Plus,
  BarChart3,
  MessageSquare,
  Zap,
  Puzzle,
  Heart,
  Bell,
  User,
  CreditCard,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const data = {
    navMain: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "My Agents",
        url: "/dashboard/agents",
        icon: Bot,
      },
      {
        title: "Create Agent",
        url: "/list-agent",
        icon: Plus,
      },
      {
        title: "Browse Marketplace",
        url: "/marketplace",
        icon: Store,
      },
      {
        title: "Favorites",
        url: "/dashboard/favorites",
        icon: Heart,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "AI Chatbot",
        url: "/dashboard/chatbot",
        icon: MessageSquare,
      },
      {
        title: "Automation",
        url: "/dashboard/automation",
        icon: Zap,
      },
      {
        title: "Integrations",
        url: "/dashboard/integrations",
        icon: Puzzle,
      },
    ],
    navSecondary: [
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Billing",
        url: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
      {
        title: "Support",
        url: "/contact",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "/feedback",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "DataClean Pro",
        url: "/dashboard/agents/1",
        icon: Frame,
      },
      {
        name: "Content Genius",
        url: "/dashboard/agents/2",
        icon: PieChart,
      },
      {
        name: "ChatBot Nigeria",
        url: "/dashboard/agents/3",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">9jaAgents</span>
                  <span className="truncate text-xs">Free plan</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
