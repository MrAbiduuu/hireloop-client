"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

type UsersPaginationProps = {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

/** Pagination footer shared by the admin user table. */
export function UsersPagination({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
}: UsersPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}–{to}</span>{" "}
        of <span className="font-medium text-foreground">{total}</span> users
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (value) => (
            <Button
              key={value}
              variant={value === page ? "default" : "outline"}
              size="icon"
              aria-label={`Page ${value}`}
              onClick={() => onChange(value)}
            >
              {value}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
