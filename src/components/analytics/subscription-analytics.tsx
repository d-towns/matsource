'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, DollarSign, Activity } from 'lucide-react';

export function SubscriptionAnalytics() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans">Subscription Analytics</h2>
          <p className="text-muted-foreground font-sans">
            Pool minutes usage and billing insights
          </p>
        </div>
        <Badge variant="secondary" className="font-sans">
          Coming Soon
        </Badge>
      </div>

      {/* Preview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Pool Usage</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---%</div>
            <p className="text-xs text-muted-foreground font-sans">
              Of monthly allocation
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Peak Concurrency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---</div>
            <p className="text-xs text-muted-foreground font-sans">
              Simultaneous calls
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">$---</div>
            <p className="text-xs text-muted-foreground font-sans">
              vs. human agents
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Efficiency Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---%</div>
            <p className="text-xs text-muted-foreground font-sans">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Subscription Analytics Features</CardTitle>
          <CardDescription className="font-sans">
            Planned metrics and visualizations for subscription and usage tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium font-sans">Usage Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                <li>• Pool minutes consumption</li>
                <li>• Concurrency patterns</li>
                <li>• Peak usage times</li>
                <li>• Overage predictions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium font-sans">Cost Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                <li>• ROI calculations</li>
                <li>• Cost per appointment</li>
                <li>• Savings vs. human agents</li>
                <li>• Plan optimization suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 