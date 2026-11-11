import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Logo } from "@/components/site-header"
import { Toaster } from "@/components/ui/toast"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />

          <div className="h-5 w-px bg-border" />

          <Logo className="text-lg" />
        </header>

        {/* Page content — centered in the area next to the sidebar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout
