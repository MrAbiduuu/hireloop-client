import { PageHeader } from "@/components/dashboard/page-header"

const SeekerDashboardPage = () => {
  return (
    <PageHeader
      crumbs={[{ label: "Seeker" }]}
      title="Seeker Dashboard"
      description="Overview of your applications, saved jobs, and resume."
    />
  )
}

export default SeekerDashboardPage
