import { SiteHeader } from "@/components/site-header"
import { JobDetailsHeader } from "@/components/browse-jobs/job-details/job-details-header"
import { JobQuickFacts } from "@/components/browse-jobs/job-details/job-quick-facts"
import { CompanyOverview } from "@/components/browse-jobs/job-details/company-overview"
import { JobDescriptionSections } from "@/components/browse-jobs/job-details/job-description-sections"
import { getJobDetails } from "@/lib/data/job-details"

/**
 * Job details page — currently renders static placeholder data
 * (see `lib/data/job-details.ts`). When the job-details API exists,
 * swap `getJobDetails(id)` for the fetch action inside the try block
 * below and render `error` instead of the job when it fails.
 */
const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  // TODO: replace with `await GetJobDetails(id)` once the backend endpoint is ready.
  const job = getJobDetails(id)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
        <JobDetailsHeader job={job} />

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <JobQuickFacts job={job} />
            <JobDescriptionSections job={job} />
          </div>

          <CompanyOverview job={job} />
        </div>
      </main>
    </>
  )
}

export default JobDetailsPage
