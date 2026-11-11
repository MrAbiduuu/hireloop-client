import { Briefcase } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Building2, Star, Users } from "lucide-react"
import { JobSearchBar } from "@/components/job-search-bar"
import globe from "@/public/images/globe.png"
import Image from "next/image"
import { cn } from "@/lib/utils"

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev ops Engineer",
]

/** Decorative ticker lines fanning out around the announcement badge */
function TickerLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("h-2.5 w-9 text-foreground/25", className)}
    >
      <path d="M0 6h24" />
      <path d="M24 6l11 4" />
      <path d="M24 6l11 -4" />
    </svg>
  )
}

function AnnouncementBadge() {
  return (
    <div className="flex items-center justify-center gap-3">
      <TickerLines className="hidden sm:block" />
      <div className="flex h-9 items-center gap-2 rounded-full border bg-card/80 px-4 text-xs backdrop-blur">
        <Briefcase className="size-3.5 text-orange-500" />
        <span className="font-semibold text-foreground">50,600+</span>
        <span className="font-mono tracking-[0.18em] text-muted-foreground uppercase">
          New Jobs This Month
        </span>
      </div>
      <TickerLines className="hidden sm:block" />
    </div>
  )
}

/** Planet artwork with atmospheric glow + starfield, fading into the page background */
function GlobeBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* globe artwork (stars + glow + planet are part of the image) */}
      <Image
        src={globe}
        alt=""
        className="absolute -top-78.75 left-1/2 w-160 max-w-none -translate-x-1/2 sm:-top-163.75 sm:w-305"
      />
      {/* fade the planet out into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background via-background/70 to-transparent" />
    </div>
  )
}

export function SiteHero() {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16">
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6">
        <AnnouncementBadge />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>
        <JobSearchBar />

        {/* trending positions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-xs text-muted-foreground">
            Trending Position
          </span>
          {trendingPositions.map((position) => (
            <Badge
              key={position}
              variant="outline"
              className="h-7 cursor-pointer rounded-full border-border/70 bg-card/80 px-3 text-xs backdrop-blur hover:bg-muted"
            >
              {position}
            </Badge>
          ))}
        </div>
      </div>

      {/* globe + overlay text + stats */}
      <div className="relative mt-12 sm:mt-20">
        <GlobeBackdrop />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mx-auto max-w-md pt-6 text-center text-2xl leading-snug font-medium text-white sm:max-w-lg sm:text-4xl">
            Assisting over{" "}
            <span className="underline decoration-indigo-400/60 decoration-2 underline-offset-4">
              15,000
            </span>{" "}
            job seekers find their dream positions.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 pb-10 sm:mt-16 sm:grid-cols-4 sm:gap-4 sm:pb-16">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                size="sm"
                className="h-full justify-between gap-8 rounded-2xl bg-card/70 p-4 text-left backdrop-blur sm:p-5"
              >
                <stat.icon
                  className="size-5 shrink-0 text-foreground/80"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
