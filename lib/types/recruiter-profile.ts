/**
 * Shape used by the recruiter profile page.
 *
 * `name`, `email` and `image` come from Better Auth. The remaining fields are
 * optional additional user fields declared in `lib/auth.ts`.
 * `hiringFocusText` is the comma separated value shown in the edit form.
 */
export type RecruiterProfile = {
  name: string
  email: string
  image: string
  phone: string
  location: string
  headline: string
  bio: string
  companyName: string
  companyWebsite: string
  companySize: string
  industry: string
  hiringFocusText: string
}

/** Only the session fields the profile page needs. */
export type RecruiterSessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  phone?: string | null
  location?: string | null
  headline?: string | null
  bio?: string | null
  companyName?: string | null
  companyWebsite?: string | null
  companySize?: string | null
  industry?: string | null
  hiringFocus?: string[] | null
}

export const emptyRecruiterProfile: RecruiterProfile = {
  name: "",
  email: "",
  image: "",
  phone: "",
  location: "",
  headline: "",
  bio: "",
  companyName: "",
  companyWebsite: "",
  companySize: "",
  industry: "",
  hiringFocusText: "",
}

/** Turn session data into a form-friendly profile, filling missing values. */
export function recruiterProfileFromSession(
  user?: RecruiterSessionUser
): RecruiterProfile {
  if (!user) return emptyRecruiterProfile

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    phone: user.phone ?? "",
    location: user.location ?? "",
    headline: user.headline ?? "",
    bio: user.bio ?? "",
    companyName: user.companyName ?? "",
    companyWebsite: user.companyWebsite ?? "",
    companySize: user.companySize ?? "",
    industry: user.industry ?? "",
    hiringFocusText: (user.hiringFocus ?? []).join(", "),
  }
}

/** Split a comma separated list into clean hiring focus names. */
export function parseHiringFocus(value: string): string[] {
  return value
    .split(",")
    .map((focus) => focus.trim())
    .filter(Boolean)
}
