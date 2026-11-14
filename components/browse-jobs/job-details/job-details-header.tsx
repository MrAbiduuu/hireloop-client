"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BadgeCheck, Bookmark, Building2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import type { JobDetails } from "@/lib/types/jobs"
import { useSession } from "@/lib/auth-client"
import { applyToAJob } from "@/lib/actions/applications"

export function JobDetailsHeader({ job }: { job: JobDetails }) {
  const { isSaved, toggle } = useSavedJobs()
  const saved = isSaved(job._id)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/signin?redirectTo=/browse-jobs/${job._id}`)
      return
    }

    if (user.role !== "seeker") {
      console.log("User Is not a Seeker")
      toast.add({
        title: "Only job seekers can apply",
        description: "You are signed in as a recruiter.",
      })
      return
    }

    setApplying(true)
    try {
      const application = {
        jobId: job._id,
        userId: user.id,
        email: user.email,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
      }
      const res = await applyToAJob(application)
      if (res.insertedId) {
        toast.add({ title: "Application submitted successfully" })

        setApplied(true)

        setTimeout(() => {
          router.push("/browse-jobs")
        }, 500)
      }
    } catch (err) {
      toast.add({
        title: "Could not submit application",
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setApplying(false)
    }
  }

  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          {/* Company logo with letter fallback */}
          <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border bg-muted text-xl font-bold text-muted-foreground">
            {job.company.logo ? (
              <Image
                src={job.company.logo}
                alt={`${job.company.name} logo`}
                width={56}
                height={56}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              job.companyName.charAt(0)
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {job.jobTitle}
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              {job.companyName}
              {job.company.isVerified && (
                <span className="inline-flex items-center gap-1 text-emerald-500">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Verified Employer
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            aria-pressed={saved}
            onClick={() => toggle(job._id)}
          >
            <Bookmark
              className={
                saved
                  ? "size-4 fill-current text-primary"
                  : "size-4 text-muted-foreground"
              }
            />
          </Button>

          {/* Apply Button */}

          <Button
            onClick={handleApplyNow}
            disabled={applying || applied}
            className="rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applied ? (
              "Applied"
            ) : applying ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Applying...
              </>
            ) : (
              "Apply Now"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">{job.jobType}</Badge>
        {job.isRemote && <Badge variant="secondary">Remote</Badge>}
      </div>
    </section>
  )
}
