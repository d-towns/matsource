import { GoogleCalendarCard } from "@/components/integrations/google-calendar-card"
import { JobberCard } from "@/components/integrations/jobber-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { PuzzleIcon } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-6">
        <PuzzleIcon className="mr-2 h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Integrations</h1>
      </div>
      
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workspaces/dashboard">Workspaces</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Integrations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Separator className="my-4" />
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Calendar Integrations</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Connect your calendar to enable appointment scheduling and availability management.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GoogleCalendarCard />
        </div>
      </section>

      <Separator className="my-6" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Business Management</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Integrate with your business management tools to sync client data, jobs, and invoicing information.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <JobberCard />
        </div>
      </section>
    </div>
  )
} 