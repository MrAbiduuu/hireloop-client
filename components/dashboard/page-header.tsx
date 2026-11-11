import Link from "next/link"

export type Crumb = {
  label: string
  /** Omit for the current page (rendered as plain text) */
  href?: string
}

/**
 * Shared dashboard page header: breadcrumb + title + description with an
 * optional action rendered on the right. Keeps every dashboard page
 * visually consistent.
 */
export function PageHeader({
  crumbs,
  title,
  description,
  action,
}: {
  crumbs: Crumb[]
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1

            return (
              <span key={crumb.label}>
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
                {!isLast && <span className="mx-1.5">/</span>}
              </span>
            )
          })}
        </p>

        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
