"use client"

import { Switch } from "@/components/ui/switch"

type AdminToggleProps = {
  checked: boolean
  disabled?: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}

/** Quick on/off control for granting or revoking admin access. */
export function AdminToggle({
  checked,
  disabled,
  label,
  onCheckedChange,
}: AdminToggleProps) {
  return (
    <label
      className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"
      title={disabled ? "You cannot change your own role" : label}
    >
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
      <span>Admin</span>
    </label>
  )
}
