"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  CalendarIcon,
  Eye,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react"

import { DeleteJob, GetJobs } from "@/lib/actions/jobs"
import type { Job } from "@/lib/types/jobs"
import { PageHeader } from "@/components/dashboard/page-header"
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Delete dialog states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // View details dialog state
  const [viewJob, setViewJob] = useState<Job | null>(null)

  async function fetchJobs() {
    try {
      const data = await GetJobs()

      setJobs((Array.isArray(data) ? data : []) as Job[])
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Failed to load jobs. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await GetJobs()

        if (!ignore) {
          setJobs((Array.isArray(data) ? data : []) as Job[])
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

  async function handleRetry() {
    setLoading(true)
    setError(null)
    await fetchJobs()
  }

  // Open confirmation dialog
  function handleDeleteClick(job: Job) {
    setSelectedJob(job)
    setDialogOpen(true)
  }

  // Confirm and delete selected job
  async function confirmDelete() {
    if (!selectedJob || deleting) return

    setDeleting(true)
    setError(null)

    try {
      await DeleteJob(selectedJob._id)

      setJobs((prev) => prev.filter((job) => job._id !== selectedJob._id))

      setDialogOpen(false)
      setSelectedJob(null)
    } catch (err) {
      console.error(err)
      setError("Failed to delete the job. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        crumbs={[{ label: "Manage Jobs", href: "/dashboard/recruiter/jobs" }, { label: "Active Listings" }]}
        title="Manage Job Posts"
        description="Review, update, or archive job listings and update details across your organization."
        action={
          <Link
            href="/dashboard/recruiter/jobs/new"
            className={buttonVariants({ size: "lg" })}
          >
            + Post New Job
          </Link>
        }
      />

      {/* Error */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span>{error}</span>

          <Button variant="outline" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {/* Jobs Table */}
      <div className="rounded-xl border border-border/60 bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Job Title & Employment</TableHead>

              <TableHead className="hidden md:table-cell">
                Company & Location
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
                const isClosed =
                  job.deadline && new Date(job.deadline) < new Date()

                return (
                  <TableRow key={job._id}>
                    {/* Job Title */}
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

                    {/* Type */}
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
                      <div className="flex items-center justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="View"
                          disabled={deleting}
                          onClick={() => setViewJob(job)}
                        >
                          <Eye className="size-3.5 text-muted-foreground" />
                        </Button>

                        <Link
                          href={`/dashboard/recruiter/jobs/new?edit=${job._id}`}
                          title="Edit"
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon-sm",
                          })}
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Delete"
                          disabled={deleting}
                          onClick={() => handleDeleteClick(job)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!deleting) {
            setDialogOpen(open)

            if (!open) {
              setSelectedJob(null)
            }
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2 />
            </AlertDialogMedia>

            <AlertDialogTitle>Delete Job?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-foreground">
                {selectedJob?.jobTitle}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              disabled={deleting || !selectedJob}
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
            >
              {deleting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete Job
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Job Details Dialog */}
      <AlertDialog
        open={viewJob !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewJob(null)
          }
        }}
      >
        {viewJob && (
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-primary/10 text-primary dark:bg-primary/20">
                <Eye />
              </AlertDialogMedia>

              <AlertDialogTitle>
                {viewJob.jobTitle || "Untitled Job"}
              </AlertDialogTitle>

              <AlertDialogDescription>
                {viewJob.companyName || "Unknown Company"}
                <span className="mx-1.5">·</span>
                {viewJob.isRemote
                  ? "Remote"
                  : viewJob.location || "Location not set"}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border bg-muted/40 p-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Employment</p>

                <p className="font-medium">{viewJob.jobType || "—"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Category</p>

                <p className="font-medium">{viewJob.jobCategory || "—"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Compensation</p>

                <p className="font-medium">
                  {formatSalary(
                    viewJob.minSalary,
                    viewJob.maxSalary,
                    viewJob.salaryFrequency
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>

                <p className="font-medium">{formatDate(viewJob.deadline)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Status</p>

                <p className="flex items-center gap-1.5 font-medium">
                  <span
                    className={
                      viewJob.deadline && new Date(viewJob.deadline) < new Date()
                        ? "size-2 rounded-full bg-muted-foreground"
                        : "size-2 rounded-full bg-emerald-500"
                    }
                  />
                  {viewJob.deadline && new Date(viewJob.deadline) < new Date()
                    ? "Closed"
                    : "Active"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Location</p>

                <p className="truncate font-medium">
                  {viewJob.isRemote
                    ? "Remote"
                    : viewJob.location || "—"}
                </p>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Close</AlertDialogCancel>

              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  setViewJob(null)
                  router.push(`/dashboard/recruiter/jobs/new?edit=${viewJob._id}`)
                }}
              >
                <Pencil className="size-4" />
                Edit This Job
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  )
}

export default ManageJobsPage
