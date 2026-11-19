import { authClient } from "@/lib/auth-client"
import type { Role } from "@/lib/types/user"

/** A user as returned by Better Auth's admin listUsers endpoint. */
export type ManagedUser = {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
  emailVerified?: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
  banned?: boolean
  premium?: boolean
  headline?: string | null
  location?: string | null
}

const ERROR_MESSAGE = "Something went wrong. Please try again."

/** Load every user so the admin can manage the whole directory in one place. */
export const getManagedUsers = async (): Promise<ManagedUser[]> => {
  const { data, error } = await authClient.admin.listUsers({
    query: { limit: 1000 },
  })

  if (error) {
    throw new Error(error.message || ERROR_MESSAGE)
  }

  return (data?.users ?? []) as ManagedUser[]
}

/** Change any user's role. Only callers with the admin role are allowed by Better Auth. */
export const setManagedUserRole = async (
  userId: string,
  role: Role | string
): Promise<void> => {
  // Better Auth's client types only know its default "user"/"admin" roles,
  // but this app stores seeker/recruiter/admin in the same field. The server
  // accepts any string role, so narrow the type only at this boundary.
  const { error } = await authClient.admin.setRole({
    userId,
    role: role as "admin" | "user",
  })

  if (error) {
    throw new Error(error.message || ERROR_MESSAGE)
  }
}
