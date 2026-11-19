"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

import type { RoleFilter } from "./types"

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admins" },
  { value: "recruiter", label: "Recruiters" },
  { value: "seeker", label: "Job seekers" },
  { value: "other", label: "Legacy roles" },
]

type UserFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: RoleFilter
  onRoleFilterChange: (value: RoleFilter) => void
  shown: number
  total: number
}

/** Search and role filter controls for the user table. */
export function UserFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  shown,
  total,
}: UserFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b p-4">
      <div className="relative min-w-48 flex-1 sm:max-w-xs">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name or email..."
          className="pl-8"
          aria-label="Search users"
        />
      </div>

      <select
        aria-label="Filter by role"
        value={roleFilter}
        onChange={(event) =>
          onRoleFilterChange(event.target.value as RoleFilter)
        }
        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {ROLE_FILTERS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <p className="ml-auto text-xs text-muted-foreground">
        {shown} of {total} users
      </p>
    </div>
  )
}
