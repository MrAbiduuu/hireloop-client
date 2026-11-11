import { PageHeader } from "@/components/dashboard/page-header"

const AdminDashboardPage = () => {
  return (
    <PageHeader
      crumbs={[{ label: "Admin" }]}
      title="Admin Dashboard"
      description="Manage users, job listings, and platform reports."
    />
  )
}

export default AdminDashboardPage
