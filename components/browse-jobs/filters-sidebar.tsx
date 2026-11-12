"use client"

import { useState } from "react"

import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/constants/jobs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select } from "@/components/ui/select"

type Filters = {
  jobTypes: string[]
  category: string
  isRemote: boolean
}

const initialFilters: Filters = {
  jobTypes: [],
  category: "",
  isRemote: false,
}

const sectionTitle = "text-xs font-medium text-muted-foreground"
const optionRow = "flex items-center gap-2.5 text-sm"

export function FiltersSidebar() {
  const [filters, setFilters] = useState<Filters>(initialFilters)

  function handleToggleType(type: string, checked: boolean) {
    setFilters((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, type]
        : prev.jobTypes.filter((t) => t !== type),
    }))
  }

  function handleCategoryChange(category: string) {
    setFilters((prev) => ({ ...prev, category }))
  }

  function handleRemoteChange(checked: boolean) {
    setFilters((prev) => ({ ...prev, isRemote: checked }))
  }

  // TODO: sync `filters` into the URL query (e.g. jobType=Full-time&jobType=Contract)
  // so the server page re-fetches the matching jobs.
  function handleClear() {
    setFilters(initialFilters)
  }

  const hasFilters =
    filters.jobTypes.length > 0 || filters.category !== "" || filters.isRemote

  return (
    <aside className="h-fit space-y-5 rounded-xl border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-sm font-semibold">Filters</h2>

      {/* Job Type */}
      <section className="space-y-3">
        <h3 className={sectionTitle}>Job Type</h3>
        {JOB_TYPES.map((type) => (
          <label key={type} className={optionRow}>
            <Checkbox
              checked={filters.jobTypes.includes(type)}
              onCheckedChange={(checked) => handleToggleType(type, checked)}
            />
            {type}
          </label>
        ))}
      </section>

      {/* Category */}
      <section className="space-y-2">
        <h3 className={sectionTitle}>Category</h3>
        <Select
          aria-label="Filter by category"
          className="h-9"
          value={filters.category}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {JOB_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </section>

      {/* Remote */}
      <label className={optionRow}>
        <Checkbox
          checked={filters.isRemote}
          onCheckedChange={(checked) => handleRemoteChange(checked)}
        />
        Remote only
      </label>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleClear}
        >
          Clear all
        </Button>
      )}
    </aside>
  )
}
