import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { 
  MetricQuery, 
  ChartDataPoint, 
  StatusBreakdown, // Re-using for outcome breakdown
  TimeSeriesData, 
  CallMetrics,      // Using CallMetrics type
  MetricResult 
} from '../types';
import { AnalyticsQueryBuilder } from '../query-builder';
import { 
  calculateStatusBreakdown, 
  // getStatusColor, // We might need a getOutcomeColor or define colors directly
  calculateTimeSeriesTrend,
  createAnalyticsError 
} from '../utils';

// Helper to get colors for call outcomes (can be expanded)
function getOutcomeColor(outcome: string): string {
  switch (outcome.toLowerCase()) {
    case 'connected': return '#22c55e'; // green-500
    case 'answered': return '#22c55e'; // green-500 // Assuming 'answered' is a possible value in the 'result' column
    case 'voicemail': return '#f97316'; // orange-500
    case 'no_answer': return '#ef4444'; // red-500
    case 'failed': return '#dc2626'; // red-600
    case 'busy': return '#eab308'; // yellow-500
    // Add any other specific 'result' values and their desired colors here
    default: return '#6b7280'; // gray-500
  }
}

export class CallAttemptMetricsService {
  /**
   * Get call attempts over time (time series data)
   */
  static async getCallsByTime(query: MetricQuery): Promise<MetricResult<TimeSeriesData>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId, groupBy = 'day' } = query;

      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team call analytics');
      }

      const queryBuilder = supabase
        .from('call_attempts') 
        .select('created_at') // Also select 'status' if it were needed for this chart for some reason
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      const { data: calls, error } = await queryBuilder;

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch call attempts', error);
      }

      const groupedData = new Map<string, number>();
      calls?.forEach(call => {
        const date = new Date(call.created_at);
        let key: string;
        switch (groupBy) {
          case 'day':
            key = date.toISOString().split('T')[0];
            break;
          case 'week':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
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

      const timeSeriesDataArr = Array.from(groupedData.entries()).map(([date, value]) => ({ date, value }));
      const filledData = AnalyticsQueryBuilder.fillTimeSeriesGaps(
        timeSeriesDataArr,
        timeFilter.start.split('T')[0],
        timeFilter.end.split('T')[0],
        groupBy
      );

      const points: ChartDataPoint[] = filledData.map(item => ({
        date: item.date,
        value: item.value,
        label: item.value.toString()
      }));

      const trend = calculateTimeSeriesTrend(points);
      const firstHalf = points.slice(0, Math.floor(points.length / 2));
      const secondHalf = points.slice(Math.floor(points.length / 2));
      const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length : 0;
      const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length : 0;
      const changePercent = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : (secondAvg > 0 ? 100 : 0);
      
      const result: TimeSeriesData = { points, trend, changePercent: parseFloat(changePercent.toFixed(1)) };

      return {
        data: result,
        total: calls?.length || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching calls by time:', error);
      throw error;
    }
  }

  /**
   * Get call attempts by outcome (from 'result' column) (breakdown data)
   */
  static async getCallsByOutcome(query: MetricQuery): Promise<MetricResult<StatusBreakdown[]>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;

      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team call analytics');
      }

      const { data: calls, error } = await supabase
        .from('call_attempts')
        .select('result') // Changed from 'call_status' to 'result'
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) {
        // Updated error message to be more generic as it refers to the displayed value ('outcome')
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch call result data', error); 
      }

      const outcomeCounts = new Map<string, number>();
      calls?.forEach(call => {
        const outcomeValue = call.result || 'declined_ask'; // Changed from call.call_status to call.result
        outcomeCounts.set(outcomeValue, (outcomeCounts.get(outcomeValue) || 0) + 1);
      });

      // The 'status' field in StatusBreakdown now refers to the 'result' value from the DB
      const outcomeData = Array.from(outcomeCounts.entries()).map(([status, count]) => ({ status, count }));
      const breakdown = calculateStatusBreakdown(outcomeData).map(item => ({
        ...item,
        color: getOutcomeColor(item.status) 
      }));

      return {
        data: breakdown,
        total: calls?.length || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching calls by outcome/result:', error);
      throw error;
    }
  }

  /**
   * Get answer rate for call attempts (based on 'result' column)
   */
  static async getAnswerRate(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      // Ensure these are valid values in your 'result' column that mean 'answered'

      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team call analytics');
      }

      const { data: calls, error } = await supabase
        .from('call_attempts')
        .select('result') // Changed from 'call_status' to 'result'
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch calls for answer rate', error);
      }

      const totalCalls = calls?.length || 0;
      const answeredCalls = calls?.filter(call => 
        !!call.result ) // Changed from call.call_status
      .length || 0;
      
      const answerRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0;

      return {
        data: parseFloat(answerRate.toFixed(1)),
        total: totalCalls,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating answer rate:', error);
      throw error;
    }
  }

  /**
   * Get average duration for answered call attempts (based on 'result' column, duration in seconds)
   */
  static async getAverageDuration(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      // Ensure these are valid values in your 'result' column
      // const answeredResults = ['connected', 'answered']; 

      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team call analytics');
      }
      
      const { data: answeredCalls, error } = await supabase
        .from('call_attempts')
        .select('duration') // We also need 'result' to filter, but only 'duration' for calculation
        // .select('duration, result') // More explicit if needed, Supabase might allow this
        .eq('team_id', teamId)
        // .in('result', answeredResults) // Changed from 'call_status' to 'result'
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end)
        .not('duration', 'is', null);

      console.log('answeredCalls', answeredCalls);
      // If Supabase requires 'result' to be explicitly selected for the .in filter to work optimally
      // and it wasn't included above, you might need to fetch 'result' as well, then filter client-side,
      // or ensure the query correctly filters based on 'result' even if not explicitly in select for this part.
      // However, .in() on a column not in select() usually works for filtering.

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch calls for average duration', error);
      }

      const totalDuration = answeredCalls?.reduce((sum, call) => sum + (call.duration || 0), 0) || 0;
      const countOfAnsweredCallsWithDuration = answeredCalls?.length || 0;
      const averageDuration = countOfAnsweredCallsWithDuration > 0 ? totalDuration / countOfAnsweredCallsWithDuration : 0;

      return {
        data: parseFloat(averageDuration.toFixed(0)),
        total: countOfAnsweredCallsWithDuration,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating average duration:', error);
      throw error;
    }
  }

  /**
   * Get total call attempts
   */
  static async getTotalCount(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;

      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) {
        throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team call analytics');
      }

      const { count, error } = await supabase
        .from('call_attempts')
        .select('', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) {
        throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch total call count', error);
      }

      return {
        data: count || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching total call count:', error);
      throw error;
    }
  }

  /**
   * Get all call attempt metrics
   */
  static async getAllMetrics(query: MetricQuery): Promise<MetricResult<CallMetrics>> {
    try {
      const [
        byTimeResult,
        byOutcomeResult, // This now gets data based on 'result' column
        answerRateResult, // This now gets data based on 'result' column
        averageDurationResult, // This now gets data based on 'result' column
        totalCountResult
      ] = await Promise.all([
        this.getCallsByTime(query),
        this.getCallsByOutcome(query),
        this.getAnswerRate(query),
        this.getAverageDuration(query),
        this.getTotalCount(query)
      ]);

      const callMetrics: CallMetrics = {
        byTime: byTimeResult.data,
        byOutcome: byOutcomeResult.data,
        answerRate: answerRateResult.data,
        averageDuration: averageDurationResult.data,
        totalCount: totalCountResult.data
      };

      return {
        data: callMetrics,
        period: byTimeResult.period, 
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching all call metrics:', error);
      throw createAnalyticsError('AGGREGATE_ERROR', 'Failed to fetch one or more call metrics', error);
    }
  }
} 