// All job-related types live here.

// All form data in one flat object — easy to read, easy to send
export type JobForm = {
  _id: string
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
