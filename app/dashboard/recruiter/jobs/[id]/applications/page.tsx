"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Search, Users } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/toast"
import {
  APPLICATION_STATUSES,
  getJobApplications,
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/lib/actions/applications"
import { GetJobs } from "@/lib/actions/jobs"
import { getUsers } from "@/lib/actions/user"
import { useSession } from "@/lib/auth-client"
import type { StoredApplication } from "@/lib/types/applications"
import type { Job } from "@/lib/types/jobs"

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Applied",
  review: "Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
}

const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  review: "bg-amber-500/15 text-amber-500",
  shortlisted: "bg-blue-500/15 text-blue-500",
  interview: "bg-violet-500/15 text-violet-500",
  offered: "bg-emerald-500/15 text-emerald-500",
  rejected: "bg-red-500/15 text-red-500",
  withdrawn: "bg-red-500/15 text-red-500",
}

function relativeTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"

  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

const JobApplicationsPage = () => {
  const params = useParams<{ id: string }>()
  const jobId = params.id

  const { data: session, isPending: sessionLoading } = useSession()
  const recruiterId = session?.user.id

  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<StoredApplication[]>([])
  const [namesById, setNamesById] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>(
    "all"
  )

  useEffect(() => {
    if (sessionLoading || !recruiterId) return

    let cancelled = false

    const id = recruiterId

    async function load() {
      setLoading(true)
      setError(null)

      try {
        // Filter jobs by the signed-in recruiter so another recruiter's job
        // can never be reviewed, even if someone opens the URL directly.
        const [myJobs, apps, users] = await Promise.all([
          GetJobs(`recruiterId=${encodeURIComponent(id)}`),
          getJobApplications(jobId),
          getUsers().catch(() => []),
        ])

        if (cancelled) return

        const ownedJob = myJobs.find((item) => item._id === jobId)
        if (!ownedJob) {
          setError("You can only review applications for your own job posts.")
          return
        }

        setJob(ownedJob)
        setApplications(apps)
        setNamesById(
          Object.fromEntries(
            users.map((user) => [user.id, user.name || user.email])
          )
        )
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load applications."
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [jobId, recruiterId, sessionLoading])

  async function handleStatusChange(
    application: StoredApplication,
    nextStatus: ApplicationStatus
  ) {
    if (!recruiterId || nextStatus === application.status) return

    const previousStatus = application.status

    // Optimistic update so the table reacts immediately.
    setApplications((prev) =>
      prev.map((item) =>
        item._id === application._id ? { ...item, status: nextStatus } : item
      )
    )
    setUpdatingId(application._id)

    try {
      await updateApplicationStatus(application._id, nextStatus, recruiterId)
      toast.add({
        title: `Moved to ${STATUS_LABELS[nextStatus]}`,
        description: namesById[application.userId] || application.email,
      })
    } catch (err) {
      // Roll back if the backend rejected the change.
      setApplications((prev) =>
        prev.map((item) =>
          item._id === application._id
            ? { ...item, status: previousStatus }
            : item
        )
      )
      toast.add({
        title: "Could not update status",
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const stats = useMemo(() => {
    const count = (statuses: ApplicationStatus[]) =>
      applications.filter((app) =>
        statuses.includes(app.status as ApplicationStatus)
      ).length

    return {
      total: applications.length,
      pending: count(["pending"]),
      inProgress: count(["review", "shortlisted", "interview"]),
      offers: count(["offered"]),
    }
  }, [applications])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false
      if (!query) return true

      const name = namesById[app.userId] || ""
      return (
        name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query)
      )
    })
  }, [applications, namesById, search, statusFilter])

  if (!sessionLoading && !recruiterId) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">Please sign in to review applicants.</p>
        <Button
          className="mt-4"
          nativeButton={false}
          render={<Link href="/signin" />}
        >
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        crumbs={[
          { label: "Manage Jobs", href: "/dashboard/recruiter/jobs" },
          { label: job?.jobTitle || "Job" },
          { label: "Applicants" },
        ]}
        title="Applicants"
        description={
          job
            ? `Review candidates for ${job.jobTitle} and move them through your hiring pipeline.`
            : "Review candidates and move them through your hiring pipeline."
        }
        action={
          <Link
            href="/dashboard/recruiter/jobs"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft className="size-4" />
            Back to Jobs
          </Link>
        }
      />

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="mx-auto size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">
            Loading applicants...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Applicants" value={stats.total} />
            <StatCard label="New Applications" value={stats.pending} />
            <StatCard label="In Progress" value={stats.inProgress} />
            <StatCard label="Offers" value={stats.offers} />
          </div>

          <div className="rounded-xl border bg-card">
            <div className="flex flex-wrap items-center gap-3 border-b p-4">
              <div className="relative min-w-48 flex-1 sm:max-w-xs">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applicants..."
                  className="pl-8"
                />
              </div>

              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "all" | ApplicationStatus
                  )
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All statuses</option>
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No applicants found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {applications.length === 0
                    ? "Applications for this job will appear here."
                    : "Try a different search or status filter."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Job Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((application) => {
                    const status = APPLICATION_STATUSES.includes(
                      application.status as ApplicationStatus
                    )
                      ? (application.status as ApplicationStatus)
                      : "pending"

                    return (
                      <TableRow key={application._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="grid size-8 shrink-0 place-items-center rounded-md border bg-muted text-sm font-bold text-muted-foreground">
                              {(namesById[application.userId] ||
                                application.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {namesById[application.userId] ||
                                  application.email.split("@")[0]}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {application.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {relativeTime(application.appliedAt)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {application.jobType || "—"}
                          <span className="mx-1">·</span>
                          {application.isRemote
                            ? "Remote"
                            : application.location || "—"}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={STATUS_CLASSES[status]}
                          >
                            {STATUS_LABELS[status]}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <select
                            aria-label={`Update status for ${application.email}`}
                            value={status}
                            disabled={updatingId === application._id}
                            onChange={(event) =>
                              handleStatusChange(
                                application,
                                event.target.value as ApplicationStatus
                              )
                            }
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {APPLICATION_STATUSES.map((option) => (
                              <option key={option} value={option}>
                                {STATUS_LABELS[option]}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default JobApplicationsPage
