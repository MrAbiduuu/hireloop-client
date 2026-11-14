"use client"

import { Banknote, Bookmark, Building2, Clock, MapPin } from "lucide-react"

import type { Job } from "@/lib/types/jobs"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

function formatSalary(job: Job) {
  if (!job.minSalary && !job.maxSalary) return null

  const range =
    job.minSalary && job.maxSalary
      ? `$${job.minSalary} - $${job.maxSalary}`
      : `$${job.minSalary || job.maxSalary}`

  return `${range} ${job.salaryFrequency}`
}

export function JobCard({ job }: { job: Job }) {
  const { isSaved, toggle } = useSavedJobs()
  const saved = isSaved(job._id)

  const salary = formatSalary(job)
  const router = useRouter()

  // Navigate to the job's details page using its id.
  const handleOpenJob = () => {
    if (!job._id) return
    router.push(`/browse-jobs/${job._id}`)
  }

  return (
    <article
      onClick={handleOpenJob}
      className="cursor-pointer rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate font-semibold">{job.jobTitle}</h3>

          <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
            <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
            {job.companyName || "Unknown Company"}
            <span aria-hidden="true">•</span>
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {job.isRemote ? "Remote" : job.location || "—"}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label={saved ? "Remove from saved jobs" : "Save job"}
          aria-pressed={saved}
          onClick={(event) => {
            // Stop the click from bubbling to the card, which would
            // navigate to the details page instead of just saving.
            event.stopPropagation()
            toggle(job._id)
          }}
        >
          <Bookmark
            className={
              saved
                ? "size-4 fill-current text-primary"
                : "size-4 text-muted-foreground"
            }
          />
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {salary && (
          <Badge variant="secondary" className="gap-1">
            <Banknote aria-hidden="true" />
            {salary}
          </Badge>
        )}

        <Badge variant="secondary" className="gap-1">
          <Clock aria-hidden="true" />
          {job.jobType}
        </Badge>

        {job.isRemote && <Badge variant="secondary">Remote</Badge>}
      </div>
    </article>
  )
}
