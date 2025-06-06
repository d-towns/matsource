import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentAnalytics } from "@/components/analytics/appointment-analytics";
import { CallAnalytics } from "@/components/analytics/call-analytics";
import { LeadAnalytics } from "@/components/analytics/lead-analytics";
import { SubscriptionAnalytics } from "@/components/analytics/subscription-analytics";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sans">Analytics Dashboard</h1>
        <p className="text-muted-foreground font-sans">
          Comprehensive insights into your agent performance and metrics
        </p>
      </div>
      
      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments" className="font-sans">Appointments</TabsTrigger>
          <TabsTrigger value="calls" className="font-sans">Calls</TabsTrigger>
          <TabsTrigger value="leads" className="font-sans">Leads</TabsTrigger>
          <TabsTrigger value="subscription" className="font-sans">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-6">
          <AppointmentAnalytics />
        </TabsContent>
        
        <TabsContent value="calls" className="space-y-6">
          <CallAnalytics />
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-6">
          <LeadAnalytics />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
