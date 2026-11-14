import type { Application } from "@/lib/types/applications"

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

  // MongoDB insertOne result: { acknowledged, insertedId }
  return res.json()
}
