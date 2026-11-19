"use client"

import type { Role } from "@/lib/types/user"

import { ASSIGNABLE_ROLES, describeRole, isAssignableRole } from "./types"

const selectStyles =
  "h-8 w-full rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"

type RoleSelectProps = {
  value: string
  disabled?: boolean
  label: string
  onChange: (role: Role) => void
}

/** Dropdown for assigning one of the three application roles. */
export function RoleSelect({
  value,
  disabled,
  label,
  onChange,
}: RoleSelectProps) {
  const hasLegacyRole = !isAssignableRole(value)

  return (
    <select
      aria-label={label}
      title={disabled ? "You cannot change your own role" : label}
      value={isAssignableRole(value) ? value : ""}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as Role)}
      className={selectStyles}
    >
      {hasLegacyRole && (
        <option value="" disabled>
          {describeRole(value).label} (legacy)
        </option>
      )}
      {ASSIGNABLE_ROLES.map((role) => (
        <option key={role} value={role}>
          {describeRole(role).label}
        </option>
      ))}
    </select>
  )
}
