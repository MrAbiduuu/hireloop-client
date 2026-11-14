import type { Application, StoredApplication } from "@/lib/types/applications"
import { toast } from "@/components/ui/toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const applyToAJob = async (data: Application) => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/applications`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/applications`)
  }

  if (!res.ok) {
    // Prefer the backend's error message (e.g. duplicate application)
    let message = `Backend responded with ${res.status}`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      // response had no JSON body — keep the default message
    }
    throw new Error(message)
  }

  toast.add({ title: "Application submitted successfully" })

  // MongoDB insertOne result: { acknowledged, insertedId }
  return res.json()
}

// Ask the backend whether the signed-in seeker already applied to this job.
// Used on page load so the Apply button shows "Applied" for repeat visits.
export const hasAppliedToJob = async (jobId: string, userId: string) => {
  let res: Response
  try {
    const params = new URLSearchParams({ jobId, userId })
    res = await fetch(`${BASE_URL}/applications/check?${params}`)
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/applications/check`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status}`)
  }

  const data = (await res.json()) as { applied?: boolean }
  return Boolean(data.applied)
}

// Fetch a seeker's applications (newest first) for the "My Applications" page.
export const getMyApplications = async (
  userId: string
): Promise<StoredApplication[]> => {
  let res: Response
  try {
    res = await fetch(
      `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" }
    )
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/applications`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status}`)
  }

  return res.json()
}

// Withdraw (delete) an application by its id.
export const deleteApplication = async (id: string) => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/applications/${id}`, { method: "DELETE" })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/applications/${id}`)
  }

  if (!res.ok) {
    let message = `Backend responded with ${res.status}`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      // response had no JSON body — keep the default message
    }
    throw new Error(message)
  }

  toast.add({ title: "Application removed" })

  // deleteOne result: { acknowledged, deletedCount }
  return res.json()
}
