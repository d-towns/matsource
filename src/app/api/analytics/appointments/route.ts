import { NextRequest, NextResponse } from 'next/server';
import { AppointmentMetricsService } from '@/lib/analytics/metrics/appointments';
import { AnalyticsQueryBuilder } from '@/lib/analytics/query-builder';
import { validateDateRange } from '@/lib/analytics/utils';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get authenticated user and team
    const supabase = await createSupabaseSSRClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Get user's active team
    const { data: userTeam, error: teamError } = await supabase
      .from('user_teams')
      .select('team_id')
      .eq('user_id', user.id)
      .single();

    if (teamError || !userTeam) {
      return NextResponse.json(
        { error: 'No team found for user' }, 
        { status: 400 }
      );
    }

    // Parse query parameters
    const metric = searchParams.get('metric');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const period = searchParams.get('period') as 'day' | 'week' | 'month' | 'quarter' | 'year';
    const groupBy = searchParams.get('groupBy') as 'day' | 'week' | 'month';
    const status = searchParams.get('status')?.split(',').filter(Boolean);

    // Validate required parameters
    if (!metric) {
      return NextResponse.json(
        { error: 'Missing required parameter: metric' }, 
        { status: 400 }
      );
    }

    // Handle default time filter or validate provided dates
    let timeFilter;
    if (start && end && period) {
      if (!validateDateRange(start, end)) {
        return NextResponse.json(
          { error: 'Invalid date range' }, 
          { status: 400 }
        );
      }
      timeFilter = { start, end, period };
    } else if (period) {
      timeFilter = AnalyticsQueryBuilder.getDefaultTimeFilter(period);
    } else {
      // Default to last 7 days
      timeFilter = AnalyticsQueryBuilder.getDefaultTimeFilter('week');
    }

    // Build query object
    const query = {
      timeFilter,
      teamId: userTeam.team_id,
      status,
      groupBy: groupBy || 'day'
    };

    // Route to appropriate metric handler
    switch (metric) {
      case 'by-time':
        const timeData = await AppointmentMetricsService.getAppointmentsByTime(query);
        return NextResponse.json(timeData);

      case 'by-status':
        const statusData = await AppointmentMetricsService.getAppointmentsByStatus(query);
        return NextResponse.json(statusData);

      case 'conversion-rate':
        const conversionData = await AppointmentMetricsService.getConversionRate(query);
        return NextResponse.json(conversionData);

      case 'total-count':
        const countData = await AppointmentMetricsService.getTotalCount(query);
        return NextResponse.json(countData);

      case 'all':
        const allData = await AppointmentMetricsService.getAllMetrics(query);
        return NextResponse.json(allData);

      default:
        return NextResponse.json(
          { error: `Invalid metric: ${metric}. Available metrics: by-time, by-status, conversion-rate, total-count, all` }, 
          { status: 400 }
        );
    }

  } catch (error: unknown) {
    console.error('Analytics API error:', error);

    // Handle known analytics errors
    if (error && typeof error === 'object' && 'code' in error) {
      const errorObj = error as { code: string; message: string };
      const statusCode = errorObj.code === 'UNAUTHORIZED' ? 403 : 500;
      return NextResponse.json(
        { error: errorObj.message, code: errorObj.code }, 
        { status: statusCode }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 