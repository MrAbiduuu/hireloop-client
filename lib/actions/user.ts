const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

type PremiumResponse = {
  premium?: boolean
  // Legacy typo written by the old backend; kept for already-upgraded users.
  permium?: boolean
}

export const getUserPremiumById = async (
  userId: string
): Promise<{ premium: boolean }> => {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}/users/${userId}/premium`, {
      cache: "no-store",
    })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/users/${userId}/premium`)
  }

  if (!response.ok) {
    throw new Error(`Backend responded with ${response.status}`)
  }

  const data = (await response.json()) as PremiumResponse | null
  return { premium: Boolean(data?.premium || data?.permium) }
}

type AppUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

// Applications only store the applicant's userId/email. Resolve those ids to
// display names so recruiters see a person rather than a raw id.
export const getUsers = async (): Promise<AppUser[]> => {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}/users`, { cache: "no-store" })
  } catch {
    throw new Error(`Cannot reach backend at ${BASE_URL}/users`)
  }

  if (!response.ok) {
    throw new Error(`Backend responded with ${response.status}`)
  }

  return response.json()
}
