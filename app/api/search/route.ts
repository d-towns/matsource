import { NextResponse } from 'next/server';
import { runSearchWorkflow } from '@/agents/searchAgent';
import { createClient } from '@/utils/supabase/server';
import redis from '@/utils/redis/client';


export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: searches, error } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(searches);
}

export async function POST(request: Request) {
  try {
    console.log("Request received")
    const body = await request.json();
    // Expected parameters: carName, year, issues, location, (optionally budget and preferredBrands)
    const { carName, year, issues, location, budget, preferredBrands, recycledParts, retailParts} = body;
    
    if (!carName || !year || !issues || !location) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    // insert a new row into the search table
    const { data, error } = await supabase.from('searches').insert({
      car_name: carName,
      year: year,
      issues: issues,
      location: location,
      budget: budget,
      preferred_brands: preferredBrands,
      recycled_parts: recycledParts,
      retail_parts: retailParts,
      user_id: user.id,
    }).select().single();

    if (error) {
      console.error('Error inserting search:', error);
      return NextResponse.json({ error: 'Error inserting search' }, { status: 500 });
    }

    const pubsub = redis.duplicate(); // Du

    // console.log("Pubsub client created", pubsub);


    // Publish the search event to Redis
    await pubsub.publish('search_events', JSON.stringify({
      id: data.id,
      carName: data.car_name,
      year: data.year,
      issues: data.issues,
      location: data.location,
      budget: data.budget,
      preferredBrands: data.preferred_brands,
      recycledParts: data.recycled_parts,
      retailParts: data.retail_parts,
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