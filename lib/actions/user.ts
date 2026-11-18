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
