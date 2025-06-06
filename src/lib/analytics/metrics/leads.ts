import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { 
  MetricQuery, 
  ChartDataPoint, 
  StatusBreakdown,
  TimeSeriesData, 
  LeadMetrics,
  MetricResult 
} from '../types';
import { AnalyticsQueryBuilder } from '../query-builder';
import { 
  calculateStatusBreakdown, 
  getStatusColor, // For lead statuses
  calculateTimeSeriesTrend,
  createAnalyticsError 
} from '../utils';

// Helper to get colors for lead sources (can be expanded)
function getLeadSourceColor(source: string): string {
  // These are examples; customize with your actual sources and desired colors
  switch (source.toLowerCase()) {
    case 'website': return '#3b82f6'; // blue-500
    case 'referral': return '#10b981'; // green-500
    case 'advertisement': return '#f59e0b'; // amber-500
    case 'social_media': return '#6366f1'; // indigo-500
    case 'organic_search': return '#84cc16'; // lime-500
    default: return '#6b7280'; // gray-500
  }
}

export class LeadMetricsService {
  /**
   * Get leads over time
   */
  static async getLeadsByTime(query: MetricQuery): Promise<MetricResult<TimeSeriesData>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId, groupBy = 'day' } = query;
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team lead analytics');

      const { data: leads, error } = await supabase
        .from('leads')
        .select('created_at')
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch leads by time', error);

      const groupedData = new Map<string, number>();
      leads?.forEach(lead => {
        const date = new Date(lead.created_at);
        let key: string;
        switch (groupBy) {
          case 'day': key = date.toISOString().split('T')[0]; break;
          case 'week': 
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
            key = weekStart.toISOString().split('T')[0]; break;
          case 'month': key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`; break;
          default: key = date.toISOString().split('T')[0];
        }
        groupedData.set(key, (groupedData.get(key) || 0) + 1);
      });

      const filledData = AnalyticsQueryBuilder.fillTimeSeriesGaps(
        Array.from(groupedData.entries()).map(([date, value]) => ({ date, value })),
        timeFilter.start.split('T')[0],
        timeFilter.end.split('T')[0],
        groupBy
      );
      const points: ChartDataPoint[] = filledData.map(item => ({ date: item.date, value: item.value, label: item.value.toString() }));
      const trend = calculateTimeSeriesTrend(points);
      const firstHalf = points.slice(0, Math.floor(points.length / 2));
      const secondHalf = points.slice(Math.floor(points.length / 2));
      const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length : 0;
      const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length : 0;
      const changePercentVal = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : (secondAvg > 0 ? 100 : 0);
      
      return {
        data: { points, trend, changePercent: parseFloat(changePercentVal.toFixed(1)) },
        total: leads?.length || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (err) { console.error('Error in getLeadsByTime:', err); throw err; }
  }

  /**
   * Get leads by source
   */
  static async getLeadsBySource(query: MetricQuery): Promise<MetricResult<StatusBreakdown[]>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team lead analytics');

      const { data: leads, error } = await supabase
        .from('leads')
        .select('source') // Assuming 'source' column exists
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch leads by source', error);

      const sourceCounts = new Map<string, number>();
      leads?.forEach(lead => {
        const source = lead.source || 'unknown';
        sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
      });
      const sourceData = Array.from(sourceCounts.entries()).map(([status, count]) => ({ status, count }));
      const breakdown = calculateStatusBreakdown(sourceData).map(item => ({ ...item, color: getLeadSourceColor(item.status) }));

      return {
        data: breakdown,
        total: leads?.length || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (err) { console.error('Error in getLeadsBySource:', err); throw err; }
  }

  /**
   * Get leads by status
   */
  static async getLeadsByStatus(query: MetricQuery): Promise<MetricResult<StatusBreakdown[]>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team lead analytics');

      const { data: leads, error } = await supabase
        .from('leads')
        .select('status') // Assuming 'status' column for leads (e.g., new, qualified)
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch leads by status', error);

      const statusCounts = new Map<string, number>();
      leads?.forEach(lead => {
        const status = lead.status || 'unknown';
        statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      });
      const statusData = Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count }));
      const breakdown = calculateStatusBreakdown(statusData).map(item => ({ ...item, color: getStatusColor(item.status) }));
      
      return {
        data: breakdown,
        total: leads?.length || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (err) { console.error('Error in getLeadsByStatus:', err); throw err; }
  }

  /**
   * Get total lead count
   */
  static async getTotalLeadCount(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team lead analytics');

      const { count, error } = await supabase
        .from('leads')
        .select('', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);

      if (error) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch total lead count', error);
      return {
        data: count || 0,
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (err) { console.error('Error in getTotalLeadCount:', err); throw err; }
  }
  
  /**
   * Get lead conversion rate (leads to appointments)
   * Assumes 'appointments' table has a 'lead_id' FK and 'leads' status can be 'converted_to_appointment' or similar
   */
  static async getLeadConversionRate(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team lead analytics');

      // Get total leads in the period
      const { count: totalLeads, error: leadsError } = await supabase
        .from('leads')
        .select('', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);
      if (leadsError) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch total leads for conversion rate', leadsError);

      // Get appointments created from leads in the period
      // This relies on appointments having a lead_id and being created within the same period for simplicity.
      // A more accurate conversion might look at leads created in period X that converted anytime, 
      // or appointments created in period Y that came from leads created anytime.
      // For now, we count appointments linked to leads, where both were created in the period.
      const { count: convertedAppointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .not('lead_id', 'is', null) // Ensure it came from a lead
        .gte('created_at', timeFilter.start) // Appointment created in period
        .lte('created_at', timeFilter.end);
        // Optionally, could join with leads table to ensure lead was also created in period if definition is strict

      if (appointmentsError) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch converted appointments for conversion rate', appointmentsError);
      
      const conversionRate = (totalLeads || 0) > 0 ? (((convertedAppointments || 0) / (totalLeads || 0)) * 100) : 0;
      
      return {
        data: parseFloat(conversionRate.toFixed(1)),
        total: totalLeads || 0, // Base for the rate
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (err) { console.error('Error in getLeadConversionRate:', err); throw err; }
  }

  /**
   * Get lead qualified rate
   * Assumes lead status 'qualified' exists in 'leads' table 'status' column.
   */
  static async getLeadQualifiedRate(query: MetricQuery): Promise<MetricResult<number>> {
    try {
      const supabase = await createSupabaseSSRClient();
      const { timeFilter, teamId } = query;
      const qualifiedStatusValue = 'qualified'; // Adapt if your status value is different
      const hasAccess = await AnalyticsQueryBuilder.validateTeamAccess(teamId);
      if (!hasAccess) throw createAnalyticsError('UNAUTHORIZED', 'Access denied to team lead analytics');

      const { data: leads, error } = await supabase
        .from('leads')
        .select('status')
        .eq('team_id', teamId)
        .gte('created_at', timeFilter.start)
        .lte('created_at', timeFilter.end);
      
      if (error) throw createAnalyticsError('QUERY_ERROR', 'Failed to fetch leads for qualified rate', error);

      const totalLeadsInPeriod = leads?.length || 0;
      const qualifiedLeads = leads?.filter(lead => lead.status?.toLowerCase() === qualifiedStatusValue).length || 0;
      const qualifiedRate = totalLeadsInPeriod > 0 ? (qualifiedLeads / totalLeadsInPeriod) * 100 : 0;

      return {
        data: parseFloat(qualifiedRate.toFixed(1)),
        total: totalLeadsInPeriod, // Base for the rate
        period: { start: timeFilter.start, end: timeFilter.end },
        generatedAt: new Date().toISOString()
      };
    } catch (err) { console.error('Error in getLeadQualifiedRate:', err); throw err; }
  }

  /**
   * Get all lead metrics
   */
  static async getAllMetrics(query: MetricQuery): Promise<MetricResult<LeadMetrics>> {
    try {
      const [
        byTimeResult,
        bySourceResult,
        byStatusResult,
        totalCountResult,
        conversionRateResult,
        qualifiedRateResult
      ] = await Promise.all([
        this.getLeadsByTime(query),
        this.getLeadsBySource(query),
        this.getLeadsByStatus(query),
        this.getTotalLeadCount(query),
        this.getLeadConversionRate(query),
        this.getLeadQualifiedRate(query)
      ]);

      const leadMetricsData: LeadMetrics = {
        byTime: byTimeResult.data,
        bySource: bySourceResult.data,
        byStatus: byStatusResult.data,
        totalCount: totalCountResult.data,
        conversionRate: conversionRateResult.data,
        qualifiedRate: qualifiedRateResult.data
      };

      return {
        data: leadMetricsData,
        period: byTimeResult.period, // Assuming all use the same period
        generatedAt: new Date().toISOString()
      };
    } catch (err) { 
      console.error('Error in getAllMetrics (Leads):', err);
      throw createAnalyticsError('AGGREGATE_ERROR', 'Failed to fetch one or more lead metrics', err);
    }
  }
} 