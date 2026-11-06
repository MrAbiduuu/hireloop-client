"use client"

import { MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function JobSearchBar() {
  return (
    <form
      className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border bg-card/80 p-2 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:gap-0"
      onSubmit={(e) => e.preventDefault() /* TODO: wire up to search */}
    >
      <label className="flex flex-1 items-center gap-2.5 px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Job title, skill or company"
          aria-label="Search jobs by title, skill or company"
          className="h-10 w-full rounded-xl border-0 bg-transparent px-0 shadow-none focus-visible:bg-transparent focus-visible:ring-0 dark:bg-transparent"
        />
      </label>
      <div className="hidden h-6 w-px bg-border sm:block" />
      <label className="flex flex-1 items-center gap-2.5 px-3">
        <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Location or Remote"
          aria-label="Search by location"
          className="h-10 w-full rounded-xl border-0 bg-transparent px-0 shadow-none focus-visible:bg-transparent focus-visible:ring-0 dark:bg-transparent"
        />
      </label>
      <div className="hidden h-6 w-px bg-border sm:block" />
      <Button
        type="submit"
        aria-label="Search"
        className="h-10 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 sm:size-10 sm:p-0"
      >
        <Search className="size-4" />
      </Button>
    </form>
  )
}
