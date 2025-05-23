export interface TimeFilter {
  start: string; // ISO date string
  end: string;   // ISO date string
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface MetricQuery {
  timeFilter: TimeFilter;
  teamId: string;
  status?: string[];
  groupBy?: 'day' | 'week' | 'month';
  limit?: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface MetricResult<T = unknown> {
  data: T;
  total?: number;
  period: {
    start: string;
    end: string;
  };
  generatedAt: string;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface TimeSeriesData {
  points: ChartDataPoint[];
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
}

export interface MetricCard {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'percentage' | 'currency' | 'duration';
  subtitle?: string;
}

// Appointment specific types
export interface AppointmentMetrics {
  byTime: TimeSeriesData;
  byStatus: StatusBreakdown[];
  conversionRate: number;
  totalCount: number;
}

// Call specific types  
export interface CallMetrics {
  byTime: TimeSeriesData;
  byOutcome: StatusBreakdown[];
  answerRate: number;
  averageDuration: number;
  totalCount: number;
}

// Lead specific types
export interface LeadMetrics {
  byTime: TimeSeriesData;
  bySource: StatusBreakdown[];
  byStatus: StatusBreakdown[];
  totalCount: number;
}

// Subscription specific types
export interface SubscriptionMetrics {
  poolMinutesUsed: number;
  poolMinutesTotal: number;
  usagePercentage: number;
  concurrencyMax: number;
  usageTrend: TimeSeriesData;
}

export type AnalyticsError = {
  code: string;
  message: string;
  details?: unknown;
}; 