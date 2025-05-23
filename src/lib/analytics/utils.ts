import { StatusBreakdown, TimeSeriesData, ChartDataPoint } from './types';

/**
 * Format numbers for display
 */
export function formatNumber(value: number, format: 'number' | 'percentage' | 'currency' | 'duration'): string {
  switch (format) {
    case 'number':
      return new Intl.NumberFormat('en-US').format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    case 'duration':
      return formatDuration(value);
    default:
      return value.toString();
  }
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}

/**
 * Format date for display
 */
export function formatDate(date: string, groupBy: string = 'day'): string {
  const d = new Date(date);
  
  switch (groupBy) {
    case 'day':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'week':
      return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    case 'month':
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    default:
      return d.toLocaleDateString('en-US');
  }
}

/**
 * Calculate status breakdown with percentages
 */
export function calculateStatusBreakdown(
  data: Array<{ status: string; count: number }>,
  statusColors?: Record<string, string>
): StatusBreakdown[] {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return data.map(item => ({
    status: item.status,
    count: item.count,
    percentage: total > 0 ? (item.count / total) * 100 : 0,
    color: statusColors?.[item.status]
  }));
}

/**
 * Default colors for different statuses
 */
export const DEFAULT_STATUS_COLORS = {
  // Appointment statuses
  scheduled: '#3b82f6',
  confirmed: '#10b981',
  completed: '#059669',
  cancelled: '#ef4444',
  no_show: '#f59e0b',
  
  // Call statuses
  connected: '#10b981',
  voicemail: '#f59e0b',
  no_answer: '#6b7280',
  busy: '#f97316',
  failed: '#ef4444',
  appointment_scheduled: '#8b5cf6',
  declined: '#ef4444',
  follow_up: '#06b6d4',
  pending: '#6b7280',
  
  // Lead statuses
  new: '#3b82f6',
  in_progress: '#f59e0b',
  appointment_set: '#10b981',
  lead_follow_up: '#06b6d4',
  lead_declined: '#ef4444',
  
  // Lead sources
  facebook: '#1877f2',
  google: '#4285f4',
  website: '#10b981',
  referral: '#8b5cf6',
  direct: '#6b7280'
};

/**
 * Get color for status
 */
export function getStatusColor(status: string): string {
  return DEFAULT_STATUS_COLORS[status as keyof typeof DEFAULT_STATUS_COLORS] || '#6b7280';
}

/**
 * Calculate time series trend
 */
export function calculateTimeSeriesTrend(data: ChartDataPoint[]): TimeSeriesData['trend'] {
  if (data.length < 2) return 'stable';
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, point) => sum + point.value, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, point) => sum + point.value, 0) / secondHalf.length;
  
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (Math.abs(changePercent) < 5) return 'stable';
  return changePercent > 0 ? 'up' : 'down';
}

/**
 * Validate date range
 */
export function validateDateRange(start: string, end: string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  return !isNaN(startDate.getTime()) && 
         !isNaN(endDate.getTime()) && 
         startDate <= endDate;
}

/**
 * Get relative time description
 */
export function getRelativeTimeDescription(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Last 24 hours';
  if (diffDays === 7) return 'Last 7 days';
  if (diffDays === 30) return 'Last 30 days';
  if (diffDays === 90) return 'Last 3 months';
  if (diffDays === 365) return 'Last year';
  
  return `${diffDays} days`;
}

/**
 * Error handling utility
 */
export function createAnalyticsError(code: string, message: string, details?: unknown) {
  return {
    code,
    message,
    details
  };
} 