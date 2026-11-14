"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/constants/jobs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select } from "@/components/ui/select"

const sectionTitle = "text-xs font-medium text-muted-foreground"
const optionRow = "flex items-center gap-2.5 text-sm"

export function FiltersSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // The URL is the single source of truth for the filter state.
  // Reading it here means checkboxes stay correct on refresh and back-navigation.
  const selectedTypes = searchParams.getAll("jobType")
  const category = searchParams.get("category") ?? ""
  const isRemote = searchParams.get("remote") === "true"

  const hasFilters = selectedTypes.length > 0 || category !== "" || isRemote

  /** Apply a change to the URL params, then navigate so the server page re-fetches. */
  function applyParams(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams)
    update(params)
    router.push(`/browse-jobs?${params.toString()}`)
  }

  function handleToggleType(type: string, checked: boolean) {
    applyParams((params) => {
      // Checkbox groups use a repeated key: ?jobType=Full-time&jobType=Contract
      const types = new Set(params.getAll("jobType"))

      if (checked) {
        types.add(type)
      } else {
        types.delete(type)
      }

      params.delete("jobType")
      types.forEach((value) => params.append("jobType", value))
    })
  }

  function handleCategoryChange(value: string) {
    applyParams((params) => {
      if (value) {
        params.set("category", value)
      } else {
        params.delete("category")
      }
    })
  }

  function handleRemoteChange(checked: boolean) {
    applyParams((params) => {
      if (checked) {
        params.set("remote", "true")
      } else {
        params.delete("remote")
      }
    })
  }

  // Clear the filters but keep the search term.
  function handleClear() {
    applyParams((params) => {
      params.delete("jobType")
      params.delete("category")
      params.delete("remote")
    })
  }

  return (
    <aside className="h-fit space-y-5 rounded-xl border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-sm font-semibold">Filters</h2>

      {/* Job Type */}
      <section className="space-y-3">
        <h3 className={sectionTitle}>Job Type</h3>
        {JOB_TYPES.map((type) => (
          <label key={type} className={optionRow}>
            <Checkbox
              checked={selectedTypes.includes(type)}
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
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {JOB_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </section>

      {/* Remote */}
      <label className={optionRow}>
        <Checkbox
          checked={isRemote}
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
