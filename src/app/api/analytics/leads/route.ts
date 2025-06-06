import { NextRequest, NextResponse } from 'next/server';
import { LeadMetricsService } from '@/lib/analytics/metrics/leads';
import { AnalyticsQueryBuilder } from '@/lib/analytics/query-builder';
import { validateDateRange } from '@/lib/analytics/utils';
import { createSupabaseSSRClient } from '@/lib/supabase/ssr';
import { TimeFilter } from '@/lib/analytics/types'; // LeadMetrics type is implicitly handled by LeadMetricsService

// const LeadMetricsService = { ... }; // REMOVE Placeholder from previous step if any

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const supabase = await createSupabaseSSRClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userTeam, error: teamError } = await supabase
      .from('user_teams')
      .select('team_id')
      .eq('user_id', user.id)
      .single();

    if (teamError || !userTeam) {
      return NextResponse.json({ error: 'No team found for user' }, { status: 400 });
    }

    const metric = searchParams.get('metric');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const period = searchParams.get('period') as TimeFilter['period'];
    const groupBy = searchParams.get('groupBy') as 'day' | 'week' | 'month';
    // Potentially add other filters like 'source' or 'status' for leads

    if (!metric) {
      return NextResponse.json({ error: 'Missing required parameter: metric' }, { status: 400 });
    }

    let timeFilter: TimeFilter;
    if (start && end && period) {
      if (!validateDateRange(start, end)) {
        return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
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
      // status: searchParams.get('status')?.split(',').filter(Boolean), // Example if status filter is added for leads
      // source: searchParams.get('source')?.split(',').filter(Boolean), // Example if source filter is added for leads
    };

    // For now, assume 'all' is the primary metric to fetch all LeadMetrics
    // Individual metric cases can be added if direct access is needed.
    if (metric === 'all') {
      const allData = await LeadMetricsService.getAllMetrics(query);
      return NextResponse.json(allData);
    } else {
      // Example: if you had LeadMetricsService.getLeadsBySource(query), etc.
      // switch (metric) {
      //   case 'by-time': ...
      //   case 'by-source': ...
      //   default: ...
      // }
      return NextResponse.json(
        { error: `Invalid metric: ${metric}. Currently only 'all' is supported for leads.` }, 
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('Lead Analytics API error:', error);

    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const errorObj = error as { code: string; message: string };
      const statusCode = errorObj.code === 'UNAUTHORIZED' ? 403 : 
                         errorObj.code === 'QUERY_ERROR' ? 500 : 
                         errorObj.code === 'AGGREGATE_ERROR' ? 500 : 
                         400; 
      return NextResponse.json(
        { error: errorObj.message, code: errorObj.code }, 
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while fetching lead analytics' }, 
      { status: 500 }
    );
  }
} 