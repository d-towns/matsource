'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, TrendingUp, Target } from 'lucide-react';

export function CallAnalytics() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans">Call Analytics</h2>
          <p className="text-muted-foreground font-sans">
            Comprehensive call performance and outcome metrics
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
            <CardTitle className="text-sm font-medium font-sans">Answer Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---%</div>
            <p className="text-xs text-muted-foreground font-sans">
              AI + Human combined
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">--m --s</div>
            <p className="text-xs text-muted-foreground font-sans">
              Per successful call
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Calls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---</div>
            <p className="text-xs text-muted-foreground font-sans">
              This period
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Appointment Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---%</div>
            <p className="text-xs text-muted-foreground font-sans">
              Calls to appointments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Call Analytics Features</CardTitle>
          <CardDescription className="font-sans">
            Planned metrics and visualizations for call performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium font-sans">Time Series Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                <li>• Call volume over time</li>
                <li>• Answer rate trends</li>
                <li>• Duration patterns</li>
                <li>• Peak calling hours</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium font-sans">Outcome Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                <li>• Call outcome breakdown</li>
                <li>• Voicemail vs. connected rates</li>
                <li>• Follow-up success tracking</li>
                <li>• Customer sentiment analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 