"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { useSession } from "@/lib/auth-client"
import {
  deleteApplication,
  getMyApplications,
} from "@/lib/actions/applications"
import type { StoredApplication } from "@/lib/types/applications"

const PAGE_SIZE = 5

// Statuses the backend assigns as the application moves through the pipeline.
// Everything not archived keeps showing under the "Active" tab.
const ARCHIVED_STATUSES = ["rejected", "withdrawn"]

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

  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function statusBadge(status: string) {
  switch (status) {
    case "review":
      return { label: "Review", className: "bg-amber-500/15 text-amber-500" }
    case "shortlisted":
      return { label: "Shortlisted", className: "bg-blue-500/15 text-blue-500" }
    case "interview":
      return {
        label: "Interview",
        className: "bg-violet-500/15 text-violet-500",
      }
    case "offered":
      return {
        label: "Offered",
        className: "bg-emerald-500/15 text-emerald-500",
      }
    case "rejected":
    case "withdrawn":
      return { label: "Rejected", className: "bg-red-500/15 text-red-500" }
    default:
      // "pending" and anything unknown
      return { label: "Applied", className: "" }
  }
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

export default function JobApplicationsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const [applications, setApplications] = useState<StoredApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [tab, setTab] = useState<"active" | "archived">("active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!user) return

    let cancelled = false

    getMyApplications(user?.id)
      .then((data) => {
        if (cancelled) return
        setApplications(data)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof Error ? err.message : "Failed to load applications."
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const stats = useMemo(() => {
    const total = applications.length
    const shortlisted = applications.filter(
      (a) => a.status === "shortlisted" || a.status === "review"
    ).length
    const interviews = applications.filter(
      (a) => a.status === "interview"
    ).length
    const offered = applications.filter((a) => a.status === "offered").length
    const successRate = total > 0 ? Math.round((offered / total) * 100) : 0

    return { total, shortlisted, interviews, successRate }
  }, [applications])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applications.filter((a) => {
      const isArchived = ARCHIVED_STATUSES.includes(a.status)
      if (tab === "archived" ? !isArchived : isArchived) return false

      if (!query) return true
      return (
        a.jobTitle.toLowerCase().includes(query) ||
        a.companyName.toLowerCase().includes(query)
      )
    })
  }, [applications, tab, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteApplication(id)
      setApplications((prev) => prev.filter((a) => a._id !== id))
    } catch (err) {
      toast.add({
        title: "Could not remove application",
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">Please sign in to see your applications.</p>
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
          { label: "Seeker", href: "/dashboard/seeker" },
          { label: "Applications" },
        ]}
        title="My Applications"
        description="Track your job applications and interview progress in real-time."
        action={
          <div className="flex items-center gap-2">
            {(["active", "archived"] as const).map((value) => (
              <Button
                key={value}
                variant={tab === value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTab(value)
                  setPage(1)
                }}
              >
                {value === "active" ? "Active" : "Archived"}
              </Button>
            ))}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Applied" value={stats.total} />
        <StatCard label="Shortlisted" value={stats.shortlisted} />
        <StatCard label="Interviews" value={stats.interviews} />
        <StatCard label="Success Rate" value={`${stats.successRate}%`} />
      </div>

      {/* Applications table */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <div className="relative max-w-xs">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search applications..."
              className="pl-8"
            />
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading your applications...
          </div>
        ) : pageItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium">
              {tab === "active"
                ? "No active applications yet."
                : "Nothing in your archive."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "active"
                ? "Apply to a job and it will show up here."
                : "Rejected or withdrawn applications appear here."}
            </p>
            {tab === "active" && (
              <Button
                className="mt-4"
                nativeButton={false}
                render={<Link href="/browse-jobs" />}
              >
                Browse Jobs
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((application) => {
                const badge = statusBadge(application.status)
                const workplace = application.isRemote
                  ? "Remote"
                  : application.location || "—"

                const jobDetailsHref = `/browse-jobs/${application.jobId}`

                return (
                  <TableRow
                    key={application._id}
                    tabIndex={0}
                    className="cursor-pointer"
                    title="View job details"
                    onClick={() => router.push(jobDetailsHref)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        router.push(jobDetailsHref)
                      }
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-md border bg-muted text-sm font-bold text-muted-foreground">
                          {application.companyName.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={jobDetailsHref}
                            className="truncate font-medium hover:underline"
                          >
                            {application.jobTitle}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {application.jobType || "—"} • {workplace}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {application.companyName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {relativeTime(application.appliedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          badge.label === "Applied" ? "secondary" : "outline"
                        }
                        className={`${badge.className} bg-green-500/15`}
                      >
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Remove application"
                        title="Remove application"
                        disabled={deletingId === application._id}
                        onClick={(e) => {
                          // Don't trigger the row's "view job details" click
                          e.stopPropagation()
                          handleDelete(application._id)
                        }}
                      >
                        <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>{" "}
              applications
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                aria-label="Next page"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
