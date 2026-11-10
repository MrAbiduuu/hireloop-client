"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  CalendarIcon,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react"

import { DeleteJob, GetJobs } from "@/lib/actions/jobs"
import type { JobForm } from "@/app/dashboard/recruiter/jobs/new/page"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Same types as the JobForm on the create page
const typeBadgeVariant = (type: string) =>
  type === "Full-time" ? "default" : "secondary"

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function formatSalary(min: string, max: string, frequency: string) {
  if (!min && !max) return "—"
  const range = min && max ? `€${min} - €${max}` : min ? `€${min}` : `€${max}`
  return `${range} ${frequency}`
}

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState<JobForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Only updates state AFTER the fetch resolves — no synchronous setState,
  // so it's safe to call from an effect
  async function fetchJobs() {
    try {
      const data = await GetJobs()
      setJobs(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load jobs. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false // guards against out-of-order updates if unmounted

    async function load() {
      try {
        const data = await GetJobs()
        if (!ignore) {
          setJobs(Array.isArray(data) ? data : [])
          setError(null)
        }
      } catch (err) {
        if (!ignore) {
          console.error(err)
          setError("Failed to load jobs. Make sure the backend is running.")
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  // Event handler — setState is fine here (not inside an effect)
  async function handleRetry() {
    setLoading(true)
    setError(null)
    await fetchJobs()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job post?")) return
    try {
      await DeleteJob(id)
      // remove it from the list without refetching
      setJobs((prev) =>
        prev.filter((job) => (job as JobForm & { _id: string })._id !== id)
      )
    } catch (err) {
      console.error(err)
      setError("Failed to delete the job.")
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            <Link href="/dashboard/recruiter" className="hover:underline">
              Manage Jobs
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Active Listings</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Job Posts
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, update, or archive job listings and update details across
            your organization.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className={buttonVariants({ size: "lg" })}
        >
          + Post New Job
        </Link>
      </div>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {/* Table (horizontal scroll on small screens) */}
      <div className="rounded-xl border border-border/60 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Job Title &amp; Employment</TableHead>
              <TableHead className="hidden md:table-cell">
                Company &amp; Location
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden lg:table-cell">
                Compensation
              </TableHead>
              <TableHead className="hidden lg:table-cell">Applicants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Deadline</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <div className="mx-auto size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No job posts yet.
                  </p>
                  <Link
                    href="/dashboard/recruiter/jobs/new"
                    className={buttonVariants({ variant: "link" })}
                  >
                    Post your first job →
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => {
                const _id = (job as JobForm & { _id: string })._id
                const isClosed =
                  job.deadline && new Date(job.deadline) < new Date()
                return (
                  <TableRow key={_id}>
                    {/* Job Title & Employment */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Briefcase className="size-4 text-muted-foreground" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {job.jobTitle || "Untitled Job"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {job.jobCategory}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company & Location */}
                    <TableCell className="hidden md:table-cell">
                      <p className="truncate text-sm">{job.companyName}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />
                        {job.isRemote ? "Remote" : job.location || "—"}
                      </p>
                    </TableCell>

                    {/* Type — same values as JobForm */}
                    <TableCell>
                      <Badge variant={typeBadgeVariant(job.jobType)}>
                        {job.jobType}
                      </Badge>
                    </TableCell>

                    {/* Compensation */}
                    <TableCell className="hidden whitespace-nowrap lg:table-cell">
                      <p className="text-sm">
                        {formatSalary(
                          job.minSalary,
                          job.maxSalary,
                          job.salaryFrequency
                        )}
                      </p>
                    </TableCell>

                    {/* Applicants */}
                    <TableCell className="hidden lg:table-cell">
                      <p className="flex items-center gap-1.5 text-sm">
                        <Users className="size-3.5 text-muted-foreground" />0
                        Applicants
                      </p>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={isClosed ? "outline" : "default"}
                        className={isClosed ? "text-muted-foreground" : ""}
                      >
                        {isClosed ? "● Closed" : "● Active"}
                      </Badge>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      <p className="flex items-center gap-1.5 text-sm">
                        <CalendarIcon className="size-3.5 text-muted-foreground" />
                        {formatDate(job.deadline)}
                      </p>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/dashboard/recruiter/jobs/new?edit=${_id}`}
                          title="Edit"
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon-sm",
                          })}
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Delete"
                          onClick={() => handleDelete(_id)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" title="More">
                          <MoreVertical className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ManageJobsPage
