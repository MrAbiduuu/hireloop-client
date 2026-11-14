"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { SORT_OPTIONS } from "@/lib/constants/jobs"
import { Select } from "@/components/ui/select"

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // The URL is the source of truth; default is "Most Recent".
  const currentSort = searchParams.get("sort") ?? SORT_OPTIONS[0]

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams)

    // Don't keep "sort=Most Recent" in the URL — it's the default.
    if (value === SORT_OPTIONS[0]) {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    router.push(`/browse-jobs?${params.toString()}`)
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      Sort by:
      <Select
        aria-label="Sort jobs"
        className="h-8 w-40"
        value={currentSort}
        onChange={(event) => handleSortChange(event.target.value)}
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
