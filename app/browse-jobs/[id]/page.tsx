import Link from "next/link"
import { SearchX } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { JobDetailsHeader } from "@/components/browse-jobs/job-details/job-details-header"
import { JobQuickFacts } from "@/components/browse-jobs/job-details/job-quick-facts"
import { CompanyOverview } from "@/components/browse-jobs/job-details/company-overview"
import { JobDescriptionSections } from "@/components/browse-jobs/job-details/job-description-sections"
import { GetJobDetails } from "@/lib/actions/jobs"
import type { JobDetails } from "@/lib/types/jobs"

/**
 * Job details page — fetches the job from the backend by the `id`
 * route param (GET /jobs/:id, see `GetJobDetails` in lib/actions/jobs.ts).
 */
const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  let job: JobDetails | null = null
  let error: string | null = null

  try {
    job = await GetJobDetails(id)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load the job details."
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-2 rounded-xl border bg-card px-6 py-16 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium">Could not load this job</p>
            <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
            <Link
              href="/browse-jobs"
              className="mt-2 rounded-xl bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              Back to Browse Jobs
            </Link>
          </div>
        )}

        {/* Job details */}
        {job && (
          <>
            <JobDetailsHeader job={job} />

            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <JobQuickFacts job={job} />
                <JobDescriptionSections job={job} />
              </div>

              <CompanyOverview job={job} />
            </div>
          </>
        )}
      </main>
    </>
  )
}

export default JobDetailsPage
