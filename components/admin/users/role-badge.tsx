import { Badge } from "@/components/ui/badge"

import { describeRole } from "./types"

/** Shared role pill used in tables and summaries. */
export function RoleBadge({ role }: { role: string }) {
  const { label, className } = describeRole(role)

  return <Badge variant="secondary" className={className}>
    {label}
  </Badge>
}
