import { SearchX } from "lucide-react"

import { GetJobs } from "@/lib/actions/jobs"
import type { JobForm } from "@/lib/types/jobs"
import { FiltersSidebar } from "@/components/browse-jobs/filters-sidebar"
import { JobCard } from "@/components/browse-jobs/job-card"
import { SearchBar } from "@/components/browse-jobs/search-bar"
import { SortSelect } from "@/components/browse-jobs/sort-select"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

function pickParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key]
  return typeof value === "string" ? value : ""
}

const BrowseJobs = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams

  // Forward every URL param as the backend query string (?search=...&jobType=...).
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value != null) as [
      string,
      string,
    ][]
  ).toString()

  let jobs: JobForm[] = []
  let error: string | null = null

  try {
    jobs = await GetJobs(query)
  } catch {
    error = "Failed to load jobs. Make sure the backend is running."
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <SearchBar query={pickParam(params, "search")} />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <FiltersSidebar />

        <section className="space-y-4">
          {/* Results header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">
              Found {jobs.length} Professional Jobs
            </h1>
            <SortSelect />
          </div>

          {/* Error state */}
          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Empty state */}
          {!error && jobs.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-xl border bg-card px-6 py-16 text-center">
              <SearchX
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="font-medium">No jobs found</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try adjusting your search keywords or clearing some filters to
                see more results.
              </p>
            </div>
          )}

          {/* Job list */}
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </section>
      </div>
    </div>
  )
}

export default BrowseJobs
