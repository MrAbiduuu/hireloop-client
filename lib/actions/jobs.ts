import type { Job, JobForm } from "@/lib/types/jobs"
import { toast } from "@/components/ui/toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const PublishJobs = async (data: JobForm) => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
    toast.promise(
      new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: "Event" }), 1000)
      }),
      {
        loading: "Publishing Job..",
        success: `Job Published`,
        error: "Could not create event.",
      }
    )
  } catch {
    // network failure — backend not running, wrong URL, CORS, etc.
    throw new Error(`Cannot reach backend at ${BASE_URL}/jobs`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const GetJobs = async (query = ""): Promise<Job[]> => {
  // Normalize the query into a proper search string: "search=react&jobType=Contract"
  // -> "/jobs/?search=react&jobType=Contract" (empty query keeps "/jobs/").
  const search = query ? `?${query.replace(/^\?/, "")}` : ""

  let res: Response
  try {
    res = await fetch(`${BASE_URL}/jobs/${search}`, { cache: "no-store" })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/jobs`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const GetJobsById = async (jobId: string): Promise<Job> => {
  const res = await fetch(`${BASE_URL}/browse-jobs/${jobId}`)
  return res.json()
}

export const DeleteJob = async (id: string) => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" })
    const time = new Date().toDateString()
    toast.add({
      title: "Job Deleted",
      description: `${time}`,
    })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/jobs/${id}`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status} ${res.statusText}`)
  }

  return res.json()
}
