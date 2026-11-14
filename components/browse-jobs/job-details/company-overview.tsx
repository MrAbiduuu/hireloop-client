import Image from "next/image"
import { ArrowUpRight, Building2 } from "lucide-react"

import type { JobDetails } from "@/lib/types/jobs"

export function CompanyOverview({ job }: { job: JobDetails }) {
  const { company } = job

  return (
    <aside className="h-fit space-y-4 rounded-xl border bg-card p-5">
      <h2 className="font-semibold">Company Overview</h2>

      {/* Cover image with gradient placeholder */}
      <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
        {company.coverImage ? (
          <Image
            src={company.coverImage}
            alt={`${company.name} office`}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-muted via-background to-muted">
            <Building2 className="size-10 text-muted-foreground/50" aria-hidden="true" />
          </div>
        )}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Size</dt>
          <dd className="truncate font-medium">{company.size}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Industry</dt>
          <dd className="truncate font-medium">{company.industry}</dd>
        </div>
      </dl>

      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border bg-background text-sm font-medium transition-colors hover:bg-muted"
      >
        Visit Website
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </aside>
  )
}
