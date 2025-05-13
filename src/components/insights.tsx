import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Insights() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Most Active Feature</CardTitle>
          <CardDescription>Based on user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">Dashboard Analytics</p>
          <p className="text-sm text-muted-foreground">Used by 78% of users daily</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Average time spent on app</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">45 minutes</p>
          <p className="text-sm text-muted-foreground">+5 minutes from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
          <CardDescription>Free to paid users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">12.5%</p>
          <p className="text-sm text-muted-foreground">+2.3% from last month</p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Important metrics and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>User retention has improved by 7% after the latest feature release.</li>
            <li>Mobile usage has surpassed desktop usage for the first time this quarter.</li>
            <li>The new onboarding process has reduced drop-off rates by 25%.</li>
            <li>Users who engage with the chat support feature are 3x more likely to upgrade to a paid plan.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

