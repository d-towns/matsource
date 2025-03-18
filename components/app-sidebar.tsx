"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  NotebookPen,
  PackageSearchIcon,
  HomeIcon,
  PuzzleIcon,
  UsersIcon,
  PhoneCallIcon,
  BotIcon,
  CalendarIcon
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const navMenuItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Superior Plumbing Co.",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/workspaces/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Sales",
      url: "/workspaces/sales",
      icon: UsersIcon,
      isActive: true,
      items: [
        {
          title: "Leads",
          url: "/workspaces/leads",
          icon: UsersIcon,
        },
        {
          title: "Appointments",
          url: "/workspaces/appointments",
          icon: CalendarIcon,
        },
        {
          title: "Call Attempts",
          url: "/workspaces/calls",
          icon: PhoneCallIcon,
        },
        {
          title: "Forms",
          url: "/workspaces/integrations/embed",
          icon: NotebookPen,
        },
      ],
    },
    {
      title: "Search",
      url: "#",
      icon: PackageSearchIcon,
      isActive: true,
      items: [
        {
          title: "Parts",
          url: "/workspaces/search/parts",
        },
        {
          title: "Vehicles",
          url: "/workspaces/search/vehicles",
        },
      ],
    },
    {
      title: "Agents",
      url: '/workspaces/agents',
      icon: BotIcon,
    },


    {
      title: "Integrations",
      url: "/workspaces/integrations",
      icon: PuzzleIcon,
    },
    {
      title: "Reports",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navMenuItems.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMenuItems.navMain} />
        {/* <NavProjects projects={navMenuItems.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
