// All job-related types live here.

// All form data in one flat object — easy to read, easy to send.
// This is the *payload* type for creating/updating a job, so it has no _id:
// the backend assigns the id when the job is created.
export type JobForm = {
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  responsibilities: string
  qualifications: string
}

// A saved job as returned by the backend
export type Job = JobForm & {
  _id: string
}

// Icon key for a benefit — resolved to a lucide icon by the UI.
// Add new keys to the icon map in components/browse-jobs/job-details/benefit-icon.tsx
export type BenefitIcon =
  | "health"
  | "retirement"
  | "hardware"
  | "time"
  | "remote"
  | "learning"
  | "wellness"
  | "generic"

export type JobBenefit = {
  icon: BenefitIcon
  label: string
}

export type CompanyOverview = {
  name: string
  /** Path under /public (e.g. "/logos/google.png") or a remote URL. Omit to get a placeholder. */
  logo?: string
  coverImage?: string
  size: string
  industry: string
  website: string
  isVerified: boolean
}

// The full job record for the details page.
// Field names intentionally overlap with JobForm so an API response
// can be mapped over with minimal changes once the endpoint exists.
export type JobDetails = {
  _id: string
  jobTitle: string
  companyName: string
  jobType: string
  isRemote: boolean
  location: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  experience: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  benefits: JobBenefit[]
  company: CompanyOverview
}
