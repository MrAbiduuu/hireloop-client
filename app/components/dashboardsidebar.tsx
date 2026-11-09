"use client"
import {
  BriefcaseBusiness,
  Building2,
  FileCheck2,
  FileText,
  Gauge,
  Heart,
  LayoutList,
  ClipboardList,
  ShieldCheck,
  UserRoundCog,
  Users,
  BookmarkPlus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

export type Role = "seeker" | "recruiter" | "admin"

type MenuItem = {
  /** Display label shown in the sidebar */
  name: string
  /** Route the item links to */
  url: string
  /** Lucide icon rendered for the item */
  icon: LucideIcon
}

const menuItemsByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: Gauge },
    { name: "Browse Jobs", url: "/dashboard/seeker/jobs", icon: BriefcaseBusiness },
    {
      name: "My Applications",
      url: "/dashboard/seeker/applications",
      icon: ClipboardList,
    },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Heart },
    { name: "My Resume", url: "/dashboard/seeker/resume", icon: FileText },
    { name: "Profile", url: "/dashboard/seeker/profile", icon: UserRoundCog },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: Gauge },
    { name: "Add Job", url: "/dashboard/recruiter/post-job", icon: BookmarkPlus },
    { name: "My Job Listings", url: "/dashboard/recruiter/jobs", icon: LayoutList },
    { name: "Applicants", url: "/dashboard/recruiter/applicants", icon: Users },
    { name: "Company Profile", url: "/dashboard/recruiter/company", icon: Building2 },
    { name: "Profile", url: "/dashboard/recruiter/profile", icon: UserRoundCog },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: Gauge },
    { name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Manage Jobs", url: "/dashboard/admin/jobs", icon: LayoutList },
    { name: "Applications", url: "/dashboard/admin/applications", icon: FileCheck2 },
    { name: "Reports", url: "/dashboard/admin/reports", icon: ShieldCheck },
    { name: "Profile", url: "/dashboard/admin/profile", icon: UserRoundCog },
  ],
}

/** Role picked from the current route, e.g. /dashboard/recruiter -> "recruiter". */
function roleFromPathname(pathname: string | null): Role | undefined {
  if (!pathname) return undefined
  const segment = pathname.split("/")[2] // ["", "dashboard", "<role>", ...]
  if (segment === "seeker" || segment === "recruiter" || segment === "admin") {
    return segment
  }
  return undefined
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Prefer the section of the dashboard we are on, so the menu is correct
  // immediately (even while the session is still loading). Fall back to the
  // session role once it becomes available.
  const role = roleFromPathname(pathname) ?? ((session?.user?.role || "seeker") as Role)

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItemsByRole[role].map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
