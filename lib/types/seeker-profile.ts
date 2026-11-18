/**
 * Shape used by the seeker profile page.
 *
 * `name`, `email` and `image` come from Better Auth. The remaining fields are
 * optional additional user fields declared in `lib/auth.ts`.
 * `skillsText` is the comma separated value shown in the edit form.
 */
export type SeekerProfile = {
  name: string
  email: string
  image: string
  headline: string
  bio: string
  location: string
  phone: string
  skillsText: string
  resumeName: string
}

/** Only the session fields the profile page needs. */
export type SeekerSessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  headline?: string | null
  bio?: string | null
  location?: string | null
  phone?: string | null
  skills?: string[] | null
  resumeName?: string | null
}

export const emptySeekerProfile: SeekerProfile = {
  name: "",
  email: "",
  image: "",
  headline: "",
  bio: "",
  location: "",
  phone: "",
  skillsText: "",
  resumeName: "",
}

/** Turn session data into a form-friendly profile, filling missing values. */
export function profileFromSession(user?: SeekerSessionUser): SeekerProfile {
  if (!user) return emptySeekerProfile

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    headline: user.headline ?? "",
    bio: user.bio ?? "",
    location: user.location ?? "",
    phone: user.phone ?? "",
    skillsText: (user.skills ?? []).join(", "),
    resumeName: user.resumeName ?? "",
  }
}

/** Split a comma separated list into a clean array of skill names. */
export function parseSkills(value: string): string[] {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
}
