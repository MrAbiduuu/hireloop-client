import { Banknote, BriefcaseBusiness, Clock, MapPin } from "lucide-react"

import type { JobDetails } from "@/lib/types/jobs"

function formatSalary(job: JobDetails) {
  if (!job.minSalary && !job.maxSalary) return "—"

  const range =
    job.minSalary && job.maxSalary
      ? `$${job.minSalary}k - $${job.maxSalary}k`
      : `$${job.minSalary || job.maxSalary}k`

  return range
}

const facts = [
  { icon: Banknote, label: "Salary Range", value: formatSalary },
  { icon: MapPin, label: "Location", value: (job: JobDetails) => (job.isRemote ? "Remote" : job.location || "—") },
  { icon: Clock, label: "Job Type", value: (job: JobDetails) => job.jobType || "—" },
  { icon: BriefcaseBusiness, label: "Experience", value: (job: JobDetails) => job.experience || "—" },
] as const

export function JobQuickFacts({ job }: { job: JobDetails }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="space-y-2 rounded-xl border bg-card p-4">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="truncate text-sm font-semibold">{value(job)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
