"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  NotebookPen,
  HomeIcon,
  PuzzleIcon,
  UsersIcon,
  PhoneCallIcon,
  BotIcon,
  CalendarIcon,
  PhoneIcon,
  HelpCircleIcon,
} from "lucide-react"

import { useTeam } from "@/context/team-context"
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
// import { Team } from "@/lib/models/team"

// This is sample data.
const navMenuItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [

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

        
      ],
    },
    {
          title: "Phone Numbers",
          url: "/workspaces/phone-numbers",
          icon: PhoneIcon,
        },
    {
      title: "Forms",
      url: "/workspaces/integrations/embed",
      icon: NotebookPen,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: PackageSearchIcon,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Parts",
    //       url: "/workspaces/search/parts",
    //     },
    //     {
    //       title: "Vehicles",
    //       url: "/workspaces/search/vehicles",
    //     },
    //   ],
    // },
    {
      title: "Agents",
      url: '/workspaces/agents',
      icon: BotIcon,
    },
    {
      title: "Third-Party Integrations",
      url: "/workspaces/integrations",
      icon: PuzzleIcon,
    },
    {
      title: "Help",
      url: "/workspaces/help",
      icon: HelpCircleIcon,
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
// const testTeams : = [
//   {
//     id: '3528eebc-664c-4ec9-b2c2-993ae8a544e4',
//     name: 'BrightWire Electric Co.',
//     description: 'Expert electrical services including wiring, lighting installation, and circuit breaker repair.',
//     role: 'member'
//   },
//   {
//     id: '74677f77-2d1a-4384-8c3f-93cdaadcdf6e',
//     name: 'Paul ',
//     description: 'asddddd',
//     role: 'owner'
//   }
// ] 
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { teams, activeTeam } = useTeam();
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
          <TeamSwitcher teams={teams} activeTeam={activeTeam} />
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
