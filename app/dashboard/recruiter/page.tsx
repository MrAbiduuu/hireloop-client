import { PageHeader } from "@/components/dashboard/page-header"

const RecruiterDashboardPage = () => {
  return (
    <PageHeader
      crumbs={[{ label: "Recruiter" }]}
      title="Recruiter Dashboard"
      description="Overview of your job posts, applicants, and hiring activity."
    />
  )
}

export default RecruiterDashboardPage
