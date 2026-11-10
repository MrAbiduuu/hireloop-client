import { JobForm } from "@/app/dashboard/recruiter/jobs/new/page"

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
  } catch {
    // network failure — backend not running, wrong URL, CORS, etc.
    throw new Error(`Cannot reach backend at ${BASE_URL}/jobs`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const GetJobs = async (): Promise<JobForm[]> => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/jobs`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export const DeleteJob = async (id: string) => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/jobs/${id}`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status} ${res.statusText}`)
  }

  return res.json()
}
