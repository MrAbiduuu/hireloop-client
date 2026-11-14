"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "hireloop-saved-jobs"

function readSavedIds(): string[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Tracks the job ids the user bookmarked, persisted in localStorage.
 * Swap the read/write logic for API calls when the backend supports it.
 */
export function useSavedJobs() {
  const [savedIds, setSavedIds] = useState<string[]>([])

  // Load after mount — avoids a hydration mismatch with localStorage.
  useEffect(() => {
    setSavedIds(readSavedIds())
  }, [])

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  )

  const toggle = useCallback((id: string) => {
    const next = readSavedIds().includes(id)
      ? readSavedIds().filter((savedId) => savedId !== id)
      : [...readSavedIds(), id]

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSavedIds(next)
  }, [])

  return { savedIds, isSaved, toggle }
}
