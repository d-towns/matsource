import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import redis from '@/utils/redis/client';


export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  // Get pagination parameters from query string
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '4');
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get total count for pagination
  const { count } = await supabase
    .from('searches')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get paginated results
  const { data: searches, error } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    searches,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected parameters: carName, year, issues, location, (optionally budget and preferredBrands)
    const { make, model, year, issues, location, distance, preferredBrands, partType} = body;
    
    if (!make || !model || !year || !issues || !location) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    // insert a new row into the search table
    const { data, error } = await supabase.from('searches').insert({
      make: make,
      model: model,
      year: year,
      issues: issues,
      location: location,
      distance: distance,
      preferred_brands: preferredBrands,
      part_search_type: partType,
      user_id: user.id,
      status: 'setup',
      step: 'Pending',
    }).select().single();

    if (error) {
      console.error('Error inserting search:', error);
      return NextResponse.json({ error: 'Error inserting search' }, { status: 500 });
    }

    const pubsub = redis.duplicate(); 

    // Publish the search event to Redis
    await pubsub.publish('search_events', JSON.stringify({
      id: data.id,
      make: data.make,
      model: data.model,
      year: data.year,
      issues: data.issues,
      location: data.location,
      distance: data.distance,
      preferredBrands: data.preferred_brands,
      partSearchType: data.part_search_type,
      userId: data.user_id,
      createdAt: data.created_at
    }));

    console.log('Search inserted and event published successfully');
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error in search workflow:', error);
    return NextResponse.json({ error: `Error in search workflow: ${error}` }, { status: 500 });
  }
} 