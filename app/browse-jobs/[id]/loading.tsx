export default function JobDetailsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
      {/* Header card */}
      <div className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="size-14 shrink-0 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-6 w-56 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
          <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/60" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-xl bg-muted/60" />
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-muted/60" />
      </div>
    </div>
  )
}
