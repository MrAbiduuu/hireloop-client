import type { ManagedUser } from "@/lib/actions/admin-users"

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

/** Overview of the user directory, rendered above the management table. */
export function UserSummary({ users }: { users: ManagedUser[] }) {
  const countByRole = (role: string) =>
    users.filter((user) => user.role === role).length

  const verified = users.filter((user) => user.emailVerified).length
  const other = users.filter(
    (user) =>
      !["admin", "recruiter", "seeker"].includes(user.role)
  ).length

  return (
    <section className="space-y-2" aria-label="User directory summary">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Total Users" value={users.length} />
        <SummaryCard label="Admins" value={countByRole("admin")} />
        <SummaryCard label="Recruiters" value={countByRole("recruiter")} />
        <SummaryCard label="Job Seekers" value={countByRole("seeker")} />
      </div>

      <p className="text-xs text-muted-foreground">
        {verified} verified email{verified === 1 ? "" : "s"}
        {other > 0 ? ` · ${other} with a legacy role` : ""}
      </p>
    </section>
  )
}
