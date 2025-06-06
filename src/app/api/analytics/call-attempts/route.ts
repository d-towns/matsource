import { NextRequest, NextResponse } from 'next/server';
import { CallAttemptMetricsService } from '@/lib/analytics/metrics/call-attempts'; // Updated import
import { AnalyticsQueryBuilder } from '@/lib/analytics/query-builder';
import { validateDateRange } from '@/lib/analytics/utils';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { TimeFilter } from '@/lib/analytics/types'; // CallMetrics is implicitly handled by the service return types

// Placeholder for the service - this will be implemented next
// const CallAttemptMetricsService = { ... }; // REMOVE Placeholder

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const supabase = await createSupabaseSSRClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

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

    const metric = searchParams.get('metric');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const period = searchParams.get('period') as TimeFilter['period'];
    const groupBy = searchParams.get('groupBy') as 'day' | 'week' | 'month';
    // Potentially add other filters like 'outcome' if needed in the future

    if (!metric) {
      return NextResponse.json(
        { error: 'Missing required parameter: metric' }, 
        { status: 400 }
      );
    }

    let timeFilter: TimeFilter;
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
      timeFilter = AnalyticsQueryBuilder.getDefaultTimeFilter('week'); // Default to last week
    }

    const query = {
      timeFilter,
      teamId: userTeam.team_id,
      groupBy: groupBy || 'day', // Default groupBy to 'day'
      // outcome: searchParams.get('outcome')?.split(',').filter(Boolean), // Example if outcome filter is added
    };

    switch (metric) {
      case 'by-time':
        const timeData = await CallAttemptMetricsService.getCallsByTime(query);
        return NextResponse.json(timeData);

      case 'by-outcome':
        const outcomeData = await CallAttemptMetricsService.getCallsByOutcome(query);
        return NextResponse.json(outcomeData);

      case 'answer-rate':
        const answerRateData = await CallAttemptMetricsService.getAnswerRate(query);
        return NextResponse.json(answerRateData);
      
      case 'average-duration':
        const avgDurationData = await CallAttemptMetricsService.getAverageDuration(query);
        return NextResponse.json(avgDurationData);

      case 'total-count':
        const countData = await CallAttemptMetricsService.getTotalCount(query);
        return NextResponse.json(countData);

      case 'all':
        const allData = await CallAttemptMetricsService.getAllMetrics(query);
        return NextResponse.json(allData); // This will now return MetricResult<CallMetrics>

      default:
        return NextResponse.json(
          { error: `Invalid metric: ${metric}. Available metrics: by-time, by-outcome, answer-rate, average-duration, total-count, all` }, 
          { status: 400 }
        );
    }

  } catch (error: unknown) {
    console.error('Call Analytics API error:', error);

    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      const statusCode = errorObj.code === 'UNAUTHORIZED' ? 403 : 
                         errorObj.code === 'QUERY_ERROR' ? 500 : 
                         errorObj.code === 'AGGREGATE_ERROR' ? 500 : 
                         400; // Default for other known errors
      return NextResponse.json(
        { error: errorObj.message, code: errorObj.code }, 
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while fetching call analytics' }, 
      { status: 500 }
    );
  }
} 