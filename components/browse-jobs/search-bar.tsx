"use client"

import { useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SearchBarProps = {
  /** Current `search` value from the URL, used as the input's initial value. */
  query?: string
}

export function SearchBar({ query = "" }: SearchBarProps) {
  const [value, setValue] = useState(query)
  const [lastQuery, setLastQuery] = useState(query)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Sync the input when the URL changes outside the form
  // (e.g. back/forward navigation). Resetting state during render
  // is the React-recommended alternative to an effect here.
  if (query !== lastQuery) {
    setLastQuery(query)
    setValue(query)
  }

  // Push the search term to the URL so the server page re-fetches the
  // matching jobs, keeping any existing filters/sort params intact.
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams(searchParams)
    if (value.trim()) {
      params.set("search", value.trim())
    } else {
      params.delete("search")
    }

    // Avoid a dangling "?" when no filters/search remain.
    const queryString = params.toString()
    router.push(queryString ? `/browse-jobs?${queryString}` : "/browse-jobs")
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col gap-2 rounded-xl border bg-card p-2 sm:flex-row sm:items-center"
    >
      <label className="flex flex-1 items-center gap-2.5 px-2">
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          name="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by job title, keywords..."
          aria-label="Search jobs by title or keywords"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:bg-transparent focus-visible:ring-0 dark:bg-transparent"
        />
      </label>
      <Button type="submit" className="h-10 shrink-0 px-6">
        Search Jobs
      </Button>
    </form>
  )
}
