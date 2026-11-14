import type { JobDetails } from "@/lib/types/jobs"

/**
 * Static placeholder data for the job details page.
 *
 * When the job-details API is ready:
 *   1. Export a `GetJobDetails(id)` action from `lib/actions/jobs.ts`
 *      that fetches `${BASE_URL}/jobs/${id}`.
 *   2. In `app/browse-jobs/[id]/page.tsx`, replace
 *      `getJobDetails(id)` with `await GetJobDetails(id)`.
 *
 * As long as the API returns the fields in `JobDetails`
 * (see `lib/types/jobs.ts`), the UI needs no further changes.
 */

const SAMPLE_JOB: JobDetails = {
  _id: "1",
  jobTitle: "Senior Product Designer",
  companyName: "CloudScale AI",
  jobType: "Full-time",
  isRemote: true,
  location: "Remote (US)",
  minSalary: "110",
  maxSalary: "180",
  salaryFrequency: "/ year",
  experience: "5+ Years",
  description:
    "At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are looking for a Senior Product Designer who is passionate about translating complex technical concepts into intuitive and delightful user experiences. In this role, you will work closely with engineering and product leadership to define the vision for our core platform experience.",
  responsibilities: [
    "Lead the end-to-end design process for major platform features, from discovery to high-fidelity prototyping.",
    "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
    "Architect and maintain our design system, ensuring consistency and accessibility across the entire product suite.",
    "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
  ],
  requirements: [
    "5+ years of professional experience designing B2B/SaaS products or data-heavy analytical applications.",
    "A strong portfolio showcasing your design process and problem-solving skills.",
  ],
  skills: ["Figma Expert", "Systems Thinking", "UX/UI Design", "Basic Frontend"],
  benefits: [
    { icon: "health", label: "Full Health & Dental" },
    { icon: "retirement", label: "Competitive 401k" },
    { icon: "hardware", label: "Latest Hardware Stipend" },
    { icon: "time", label: "Unlimited PTO" },
  ],
  company: {
    name: "CloudScale AI",
    size: "250 - 500 Employees",
    industry: "SaaS / Artificial Intelligence",
    website: "https://example.com",
    isVerified: true,
    // Add "/logos/google.png" style paths (or remote URLs) once real
    // company images exist — the placeholders render automatically.
    logo: undefined,
    coverImage: undefined,
  },
}

/**
 * Placeholder lookup. Ignore the id for now and always return the sample;
 * once the API exists, this whole function is replaced by the fetch.
 */
export function getJobDetails(id: string): JobDetails {
  return { ...SAMPLE_JOB, _id: id }
}
