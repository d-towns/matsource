'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TimeSeriesChart } from './charts/time-series-chart';
import { StatusBreakdownChart } from './charts/status-breakdown-chart';
import { MetricCard } from './charts/metric-card';
import { AppointmentMetrics, TimeFilter } from '@/lib/analytics/types';
import { getRelativeTimeDescription } from '@/lib/analytics/utils';
import { Calendar, TrendingUp, Users, Target, AlertCircle, RefreshCw } from 'lucide-react';

interface AppointmentAnalyticsProps {
  className?: string;
}

export function AppointmentAnalytics({ className }: AppointmentAnalyticsProps) {
  const [data, setData] = useState<AppointmentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimeFilter['period']>('week');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch appointment metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        metric: 'all',
        period,
        groupBy
      });

      const response = await fetch(`/api/analytics/appointments?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch appointment metrics');
      }

      const result = await response.json();
      setData(result.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching appointment metrics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and period changes
  useEffect(() => {
    fetchMetrics();
  }, [period, groupBy]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [period, groupBy]);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`space-y-6 font-sans ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Metric cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`space-y-6 font-sans ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load appointment analytics: {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchMetrics}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`space-y-6 font-sans ${className}`}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No appointment data available for the selected period.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`space-y-6 font-sans ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans">Appointment Analytics</h2>
          <p className="text-muted-foreground font-sans">
            {getRelativeTimeDescription(
              data.byTime.points[0]?.date || '',
              data.byTime.points[data.byTime.points.length - 1]?.date || ''
            )}
            {lastUpdated && (
              <span className="ml-2">• Last updated: {lastUpdated}</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value: TimeFilter['period']) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={groupBy} onValueChange={(value: 'day' | 'week' | 'month') => setGroupBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">By Day</SelectItem>
              <SelectItem value="week">By Week</SelectItem>
              <SelectItem value="month">By Month</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Appointments"
          value={data.totalCount}
          format="number"
          subtitle={`${data.byTime.points.reduce((sum, p) => sum + p.value, 0)} in period`}
          trend={data.byTime.trend}
          change={data.byTime.changePercent}
          changeType="increase"
          icon={Calendar}
          color="#3b82f6"
        />

        <MetricCard
          title="Conversion Rate"
          value={data.conversionRate}
          format="percentage"
          subtitle="Calls to appointments"
          trend={data.conversionRate > 15 ? 'up' : data.conversionRate < 10 ? 'down' : 'stable'}
          change={data.conversionRate - 12.5} // Assuming 12.5% baseline
          changeType="increase"
          icon={Target}
          color="#10b981"
        />

        <MetricCard
          title="Daily Average"
          value={Math.round(data.byTime.points.reduce((sum, p) => sum + p.value, 0) / data.byTime.points.length)}
          format="number"
          subtitle="Appointments per day"
          trend={data.byTime.trend}
          change={data.byTime.changePercent}
          changeType="increase"
          icon={TrendingUp}
          color="#8b5cf6"
        />

        <MetricCard
          title="Most Common Status"
          value={data.byStatus.length > 0 ? data.byStatus[0].status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
          format="number"
          subtitle={data.byStatus.length > 0 ? `${data.byStatus[0].percentage.toFixed(1)}% of total` : ''}
          icon={Users}
          color="#f59e0b"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Time Series Chart */}
        <TimeSeriesChart
          data={data.byTime.points}
          title="Appointments Over Time"
          description={`Appointments ${groupBy === 'day' ? 'daily' : groupBy === 'week' ? 'weekly' : 'monthly'} trend`}
          type="area"
          color="#3b82f6"
          groupBy={groupBy}
          trend={data.byTime.trend}
          changePercent={data.byTime.changePercent}
          height={300}
        />

        {/* Status Breakdown Chart */}
        <StatusBreakdownChart
          data={data.byStatus}
          title="Appointment Status Distribution"
          description="Breakdown of appointments by current status"
          type="donut"
          height={300}
        />
      </div>

      {/* Additional Insights */}
      {data.byStatus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Status Insights</CardTitle>
            <CardDescription className="font-sans">
              Key observations from your appointment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.byStatus.slice(0, 3).map((status, index) => (
                <div key={status.status} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium font-sans">
                      {status.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      {status.count} appointments ({status.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge variant="secondary" className="font-sans">
                      Most Common
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 