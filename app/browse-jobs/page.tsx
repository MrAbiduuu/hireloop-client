import { GetJobs } from "@/lib/actions/jobs"

const BrowseJobs = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const UrlSearch = new URLSearchParams(search as Record<string, string>)
  const query = UrlSearch.toString()
  console.log("Search Params : ", query)
  const jobs = await GetJobs(query)

  return (
    <div>
      <div>Browse Jobs</div>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>{job.jobTitle}</li>
        ))}
      </ul>
    </div>
  )
}

export default BrowseJobs
