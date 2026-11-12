"use client"

import { SORT_OPTIONS } from "@/lib/constants/jobs"
import { Select } from "@/components/ui/select"

export function SortSelect() {
  // TODO: push the selected `sort` value to the URL so the server page
  // re-fetches the jobs in the requested order.
  function handleSortChange() {}

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      Sort by:
      <Select
        aria-label="Sort jobs"
        className="h-8 w-40"
        defaultValue={SORT_OPTIONS[0]}
        onChange={handleSortChange}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  )
}
