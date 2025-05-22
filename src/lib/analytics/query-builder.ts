import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { TimeFilter, MetricQuery } from './types';

export class AnalyticsQueryBuilder {
  /**
   * Build time filter for SQL queries
   */
  static buildTimeFilter(filter: TimeFilter) {
    return {
      gte: filter.start,
      lte: filter.end
    };
  }

  /**
   * Build status filter for SQL queries
   */
  static buildStatusFilter(statuses?: string[]) {
    return statuses?.length ? { in: statuses } : undefined;
  }

  /**
   * Get SQL date truncation expression for grouping
   */
  static getDateTruncation(groupBy: string = 'day') {
    const truncations = {
      day: "date_trunc('day', created_at)",
      week: "date_trunc('week', created_at)", 
      month: "date_trunc('month', created_at)"
    };
    return truncations[groupBy as keyof typeof truncations] || truncations.day;
  }

  /**
   * Generate date range for filling gaps in time series
   */
  static generateDateRange(start: string, end: string, groupBy: string = 'day'): string[] {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      
      switch (groupBy) {
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }
    
    return dates;
  }

  /**
   * Fill gaps in time series data with zero values
   */
  static fillTimeSeriesGaps(
    data: Array<{ date: string; value: number }>,
    start: string,
    end: string,
    groupBy: string = 'day'
  ) {
    const dateRange = this.generateDateRange(start, end, groupBy);
    const dataMap = new Map(data.map(item => [item.date, item.value]));
    
    return dateRange.map(date => ({
      date,
      value: dataMap.get(date) || 0
    }));
  }

  /**
   * Calculate percentage change between two values
   */
  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Calculate trend direction
   */
  static calculateTrend(changePercent: number): 'up' | 'down' | 'stable' {
    if (Math.abs(changePercent) < 5) return 'stable';
    return changePercent > 0 ? 'up' : 'down';
  }

  /**
   * Parse query parameters from URL search params
   */
  static parseQueryParams(searchParams: URLSearchParams): Partial<MetricQuery> {
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const period = searchParams.get('period') as TimeFilter['period'];
    const groupBy = searchParams.get('groupBy') as MetricQuery['groupBy'];
    const status = searchParams.get('status')?.split(',').filter(Boolean);
    const limit = searchParams.get('limit');

    const query: Partial<MetricQuery> = {};

    if (start && end && period) {
      query.timeFilter = { start, end, period };
    }

    if (groupBy) {
      query.groupBy = groupBy;
    }

    if (status?.length) {
      query.status = status;
    }

    if (limit) {
      query.limit = parseInt(limit, 10);
    }

    return query;
  }

  /**
   * Get default time filter for common periods
   */
  static getDefaultTimeFilter(period: TimeFilter['period']): TimeFilter {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'day':
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }

    return {
      start: start.toISOString(),
      end: end.toISOString(),
      period
    };
  }

  /**
   * Validate team access for analytics queries
   */
  static async validateTeamAccess(teamId: string): Promise<boolean> {
    try {
      const supabase = await createSupabaseSSRClient();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return false;

      const { data: userTeam, error: teamError } = await supabase
        .from('user_teams')
        .select('team_id, role')
        .eq('user_id', user.id)
        .eq('team_id', teamId)
        .single();

      return !teamError && !!userTeam;
    } catch (error) {
      console.error('Team access validation error:', error);
      return false;
    }
  }
} 