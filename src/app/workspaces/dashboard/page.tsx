import { AppPerformance } from "@/components/app-performance";
import { Insights } from "@/components/insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserFeedback } from "@/components/user-feedback";
import { UserStats } from "@/components/user-stats";

export default function DashboardPage() {
  return (
    <div>
      <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <Tabs defaultValue="user-stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user-stats">User Stats</TabsTrigger>
          <TabsTrigger value="app-performance">App Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="user-feedback">User Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="user-stats">
          <UserStats />
        </TabsContent>
        <TabsContent value="app-performance">
          <AppPerformance />
        </TabsContent>
        <TabsContent value="insights">
          <Insights />
        </TabsContent>
        <TabsContent value="user-feedback">
          <UserFeedback />
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}
