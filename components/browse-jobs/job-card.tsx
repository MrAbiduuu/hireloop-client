"use client"

import {
  Banknote,
  Bookmark,
  Building2,
  Clock,
  MapPin,
} from "lucide-react"

import type { JobForm } from "@/lib/types/jobs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function formatSalary(job: JobForm) {
  if (!job.minSalary && !job.maxSalary) return null

  const range =
    job.minSalary && job.maxSalary
      ? `$${job.minSalary} - $${job.maxSalary}`
      : `$${job.minSalary || job.maxSalary}`

  return `${range} ${job.salaryFrequency}`
}

export function JobCard({ job }: { job: JobForm }) {
  // TODO: save/bookmark this job for the signed-in user.
  function handleSave() {}

  const salary = formatSalary(job)

  return (
    <article className="rounded-xl border bg-card p-5 transition-colors hover:border-primary/40">
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
          aria-label="Save job"
          onClick={handleSave}
        >
          <Bookmark className="size-4 text-muted-foreground" />
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
