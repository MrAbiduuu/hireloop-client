import type { Role } from "@/lib/types/user"

/** Roles an admin can explicitly assign from this screen. */
export const ASSIGNABLE_ROLES: Role[] = ["seeker", "recruiter", "admin"]

export type RoleFilter = "all" | Role | "other"

/** Human-friendly label and styling for any stored role, including legacy ones. */
export function describeRole(role: string) {
  switch (role) {
    case "admin":
      return { label: "Admin", className: "bg-primary/15 text-primary" }
    case "recruiter":
      return {
        label: "Recruiter",
        className: "bg-violet-500/15 text-violet-500",
      }
    case "seeker":
      return {
        label: "Job Seeker",
        className: "bg-sky-500/15 text-sky-500",
      }
    case "user":
    case "candidate":
      return { label: "Candidate", className: "bg-muted text-muted-foreground" }
    default:
      return {
        label: role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown",
        className: "bg-muted text-muted-foreground",
      }
  }
}

export function isAssignableRole(role: string): role is Role {
  return ASSIGNABLE_ROLES.includes(role as Role)
}

export function matchesRoleFilter(
  role: string,
  filter: RoleFilter
): boolean {
  if (filter === "all") return true
  if (filter === "other") return !isAssignableRole(role)
  return role === filter
}

export function formatDate(value?: string | Date) {
  if (!value) return "—"

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

/** Initials used by the avatar placeholder. */
export function initials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "?"
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}
