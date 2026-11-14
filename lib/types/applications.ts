// An application as sent from the client when a seeker applies to a job.
// The backend adds `status` and `appliedAt` on insert.
export type Application = {
  jobId: string
  userId: string
  email: string
  jobTitle: string
  companyName: string

  // Snapshot of the job at apply time, so "My Applications" can still show
  // the job type / workplace even if the job is edited or deleted later.
  jobType: string
  isRemote: boolean
  location: string
}

// An application as returned by the backend
export type StoredApplication = Application & {
  _id: string
  status: string
  appliedAt: string
}
