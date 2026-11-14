import { Badge } from "@/components/ui/badge"
import { BenefitIconGlyph } from "@/components/browse-jobs/job-details/benefit-icon"
import type { JobDetails } from "@/lib/types/jobs"

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-muted-foreground">
      <span
        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/70"
        aria-hidden="true"
      />
      {children}
    </li>
  )
}

export function JobDescriptionSections({ job }: { job: JobDetails }) {
  return (
    <section className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">
      {/* Description */}
      <div className="space-y-3">
        <h2 className="font-semibold">Job Description</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {job.description}
        </p>
      </div>

      {/* Responsibilities */}
      {job.responsibilities.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Responsibilities</h2>
          <ul className="space-y-2.5">
            {job.responsibilities.map((item) => (
              <BulletItem key={item}>{item}</BulletItem>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Requirements</h2>
          {job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
          <ul className="space-y-2.5">
            {job.requirements.map((item) => (
              <BulletItem key={item}>{item}</BulletItem>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {job.benefits.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Benefits</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {job.benefits.map((benefit) => (
              <li key={benefit.label} className="flex items-center gap-3 text-sm">
                <BenefitIconGlyph icon={benefit.icon} />
                {benefit.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
