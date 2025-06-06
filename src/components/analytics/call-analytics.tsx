'use client'

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TimeSeriesChart } from './charts/time-series-chart';
import { StatusBreakdownChart } from './charts/status-breakdown-chart';
import { MetricCard } from './charts/metric-card';
import { CallMetrics, TimeFilter } from '@/lib/analytics/types';
import { getRelativeTimeDescription } from '@/lib/analytics/utils';
import { Phone, Clock, PieChart, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

interface CallAnalyticsProps {
  className?: string;
}

export function CallAnalytics({ className }: CallAnalyticsProps) {
  const [data, setData] = useState<CallMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimeFilter['period']>('week');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        metric: 'all',
        period,
        groupBy
      });

      const response = await fetch(`/api/analytics/call-attempts?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch call attempt metrics');
      }

      const result = await response.json();
      console.log('result', result.data);
      setData(result.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching call attempt metrics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [period, groupBy]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

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
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 font-sans ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load call analytics: {error}
            <Button variant="outline" size="sm" onClick={fetchMetrics} className="ml-2">
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
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
            No call attempt data available for the selected period.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalCallsInPeriod = data.byTime.points.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className={`space-y-6 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans">Call Analytics</h2>
          <p className="text-muted-foreground font-sans">
            {getRelativeTimeDescription(
              data.byTime.points[0]?.date || '',
              data.byTime.points[data.byTime.points.length - 1]?.date || ''
            )}
            {lastUpdated && (
              <span className="ml-2 text-xs">• Last updated: {lastUpdated}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value: TimeFilter['period']) => setPeriod(value)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(value: 'day' | 'week' | 'month') => setGroupBy(value)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">By Day</SelectItem>
              <SelectItem value="week">By Week</SelectItem>
              <SelectItem value="month">By Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchMetrics} title="Refresh data">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Calls"
          value={data.totalCount}
          format="number"
          subtitle={`${totalCallsInPeriod} in period`}
          trend={data.byTime.trend}
          change={data.byTime.changePercent}
          icon={Phone}
          color="#3b82f6"
        />
        <MetricCard
          title="Answer Rate"
          value={data.answerRate}
          format="percentage"
          subtitle="Connected calls"
          trend={data.answerRate > 70 ? 'up' : data.answerRate < 50 ? 'down' : 'stable'}
          icon={CheckCircle}
          color="#10b981"
        />
        <MetricCard
          title="Avg Duration"
          value={data.averageDuration}
          format="duration"
          subtitle="Of answered calls"
          icon={Clock}
          color="#8b5cf6"
        />
        <MetricCard
          title="Most Common Outcome"
          value={data.byOutcome.length > 0 ? data.byOutcome[0].status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
          subtitle={data.byOutcome.length > 0 ? `${data.byOutcome[0].percentage.toFixed(1)}% of total` : ''}
          icon={PieChart}
          color="#f59e0b"
          format="number"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TimeSeriesChart
          data={data.byTime.points}
          title="Call Volume Over Time"
          description={`Calls ${groupBy === 'day' ? 'daily' : groupBy === 'week' ? 'weekly' : 'monthly'} trend`}
          type="line"
          color="#3b82f6"
          groupBy={groupBy}
          trend={data.byTime.trend}
          changePercent={data.byTime.changePercent}
          height={300}
        />
        <StatusBreakdownChart
          data={data.byOutcome}
          title="Call Outcome Distribution"
          description="Breakdown of calls by outcome"
          type="donut"
          height={300}
        />
      </div>

      {data.byOutcome.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Outcome Insights</CardTitle>
            <CardDescription className="font-sans">
              Key observations from your call attempt data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.byOutcome.slice(0, 3).map((outcome, index) => (
                <div key={outcome.status} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: outcome.color || '#ccc' }}
                  />
                  <div className="flex-1">
                    <div className="font-medium font-sans">
                      {outcome.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      {outcome.count} calls ({outcome.percentage.toFixed(1)}%)
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