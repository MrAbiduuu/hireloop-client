import type { Application, StoredApplication } from "@/lib/types/applications"
import { toast } from "@/components/ui/toast"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Statuses a recruiter can set while reviewing an applicant.
export const APPLICATION_STATUSES = [
  "pending",
  "review",
  "shortlisted",
  "interview",
  "offered",
  "rejected",
  "withdrawn",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

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
export const getMyApplicationsCount = async (
  userId: string
): Promise<{ count: number }> => {
  let res: Response
  try {
    res = await fetch(
      `${BASE_URL}/applications/count?userId=${encodeURIComponent(userId)}`,
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

// Fetch every application for one job — used by the recruiter review page.
export const getJobApplications = async (
  jobId: string
): Promise<StoredApplication[]> => {
  let res: Response
  try {
    res = await fetch(
      `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`,
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

// Number of applicants for a job (for the Manage Jobs table).
export const getJobApplicationsCount = async (
  jobId: string
): Promise<{ count: number }> => {
  let res: Response
  try {
    res = await fetch(
      `${BASE_URL}/applications/count?jobId=${encodeURIComponent(jobId)}`,
      { cache: "no-store" }
    )
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/applications/count`)
  }

  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status}`)
  }

  return res.json()
}

// Move an applicant to a new stage. The backend checks that the job belongs
// to this recruiter before allowing the change.
export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus,
  recruiterId: string
) => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, recruiterId }),
    })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/applications/${id}/status`)
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

  return res.json()
}
