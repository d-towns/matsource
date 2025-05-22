'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, TrendingUp, Filter } from 'lucide-react';

export function LeadAnalytics() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans">Lead Analytics</h2>
          <p className="text-muted-foreground font-sans">
            Lead generation performance and source analysis
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
            <CardTitle className="text-sm font-medium font-sans">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium font-sans">Top Source</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---</div>
            <p className="text-xs text-muted-foreground font-sans">
              Lead source
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---%</div>
            <p className="text-xs text-muted-foreground font-sans">
              Leads to appointments
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Qualified Rate</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">---%</div>
            <p className="text-xs text-muted-foreground font-sans">
              Quality leads
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Lead Analytics Features</CardTitle>
          <CardDescription className="font-sans">
            Planned metrics and visualizations for lead performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium font-sans">Source Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                <li>• Lead source breakdown</li>
                <li>• Source quality comparison</li>
                <li>• Cost per lead by source</li>
                <li>• ROI by marketing channel</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium font-sans">Conversion Tracking</h4>
              <ul className="text-sm text-muted-foreground space-y-1 font-sans">
                <li>• Lead status progression</li>
                <li>• Time to conversion</li>
                <li>• Follow-up effectiveness</li>
                <li>• Lost lead analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 