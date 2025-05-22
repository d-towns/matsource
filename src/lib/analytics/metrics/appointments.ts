import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { 
  MetricQuery, 
  ChartDataPoint, 
  StatusBreakdown, 
  TimeSeriesData, 
  AppointmentMetrics,
  MetricResult 
} from '../types';
import { AnalyticsQueryBuilder } from '../query-builder';
import { 
  calculateStatusBreakdown, 
  getStatusColor, 
  calculateTimeSeriesTrend,
  createAnalyticsError 
} from '../utils';

export class AppointmentMetricsService {
  /**
   * Get appointments over time (time series data)
   */
  static async getAppointmentsByTime(query: MetricQuery): Promise<MetricResult<TimeSeriesData>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId, status, groupBy = 'day' } = query;

      // Validate team access
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team analytics');
      }

      // Build the query
      let queryBuilder = supabase
        .from('appointments')
        .select('created_at')
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      // Add status filter if provided
      if (status?.length) {
        queryBuilder = queryBuilder.in('status', status);
      }

      const { data: appointments, error } = await queryBuilder;

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch appointments', error);
      }

      // Group by time period
      const groupedData = new Map<string, number>();
      
      appointments?.forEach(appointment => {
        const date = new Date(appointment.created_at);
        let key: string;

        switch (groupBy) {
          case 'day':
            key = date.toISOString().split('T')[0];
            break;
          case 'week':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().split('T')[0];
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
            break;
          default:
            key = date.toISOString().split('T')[0];
        }

        groupedData.set(key, (groupedData.get(key) || 0) + 1);
      });

      // Convert to array and fill gaps
      const timeSeriesData = Array.from(groupedData.entries()).map(([date, value]) => ({
        date,
        value
      }));

      // Fill gaps with zero values
      const filledData = AnalyticsQueryBuilder.fillTimeSeriesGaps(
        timeSeriesData,
        timeFilter.start.split('T')[0],
        timeFilter.end.split('T')[0],
        groupBy
      );

      // Convert to ChartDataPoint format
      const points: ChartDataPoint[] = filledData.map(item => ({
        date: item.date,
        value: item.value,
        label: item.value.toString()
      }));

      // Calculate trend
      const trend = calculateTimeSeriesTrend(points);

      // Calculate change percentage (compare first and second half)
      const firstHalf = points.slice(0, Math.floor(points.length / 2));
      const secondHalf = points.slice(Math.floor(points.length / 2));
      const firstAvg = firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length;
      const changePercent = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

      const result: TimeSeriesData = {
        points,
        trend,
        changePercent
      };

      return {
        data: result,
        total: appointments?.length || 0,
        period: {
          start: timeFilter.start,
          end: timeFilter.end
        },
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching appointments by time:', error);
      throw error;
    }
  }

  /**
   * Get appointments by status (breakdown data)
   */
  static async getAppointmentsByStatus(query: MetricQuery): Promise<MetricResult<StatusBreakdown[]>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;

      // Validate team access
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team analytics');
      }

      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('status')
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch appointment statuses', error);
      }

      // Group by status
      const statusCounts = new Map<string, number>();
      appointments?.forEach(appointment => {
        const status = appointment.status || 'unknown';
        statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      });

      // Convert to array format
      const statusData = Array.from(statusCounts.entries()).map(([status, count]) => ({
        status,
        count
      }));

      // Calculate breakdown with percentages and colors
      const breakdown = calculateStatusBreakdown(statusData).map(item => ({
        ...item,
        color: getStatusColor(item.status)
      }));

      return {
        data: breakdown,
        total: appointments?.length || 0,
        period: {
          start: timeFilter.start,
          end: timeFilter.end
        },
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      throw error;
    }
  }

  /**
   * Get appointment conversion rate (calls to appointments)
   */
  static async getConversionRate(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;

      // Validate team access
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team analytics');
      }

      // Get total calls in the period
      const { data: calls, error: callsError } = await supabase
        .from('call_attempts')
        .select('id')
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (callsError) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch calls for conversion rate', callsError);
      }

      // Get appointments created from calls in the period
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end)
        .not('call_attempt_id', 'is', null);

      if (appointmentsError) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch appointments for conversion rate', appointmentsError);
      }

      const totalCalls = calls?.length || 0;
      const appointmentsFromCalls = appointments?.length || 0;
      const conversionRate = totalCalls > 0 ? (appointmentsFromCalls / totalCalls) * 100 : 0;

      return {
        data: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
        total: totalCalls,
        period: {
          start: timeFilter.start,
          end: timeFilter.end
        },
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error calculating conversion rate:', error);
      throw error;
    }
  }

  /**
   * Get total appointment count
   */
  static async getTotalCount(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId, status } = query;

      // Validate team access
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team analytics');
      }

      let queryBuilder = supabase
        .from('appointments')
        .select('id', { count: 'exact' })
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      // Add status filter if provided
      if (status?.length) {
        queryBuilder = queryBuilder.in('status', status);
      }

      const { count, error } = await queryBuilder;

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch appointment count', error);
      }

      return {
        data: count || 0,
        period: {
          start: timeFilter.start,
          end: timeFilter.end
        },
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching appointment count:', error);
      throw error;
    }
  }

  /**
   * Get all appointment metrics in one call
   */
  static async getAllMetrics(query: MetricQuery): Promise<MetricResult<AppointmentMetrics>> {
    try {
      const [byTime, byStatus, conversionRate, totalCount] = await Promise.all([
        this.getAppointmentsByTime(query),
        this.getAppointmentsByStatus(query),
        this.getConversionRate(query),
        this.getTotalCount(query)
      ]);

      const metrics: AppointmentMetrics = {
        byTime: byTime.data,
        byStatus: byStatus.data,
        conversionRate: conversionRate.data,
        totalCount: totalCount.data
      };

      return {
        data: metrics,
        period: {
          start: query.timeFilter.start,
          end: query.timeFilter.end
        },
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching all appointment metrics:', error);
      throw error;
    }
  }
} 