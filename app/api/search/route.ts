import { NextResponse } from 'next/server';
import { runSearchWorkflow } from '@/agents/searchAgent';

export async function POST(request: Request) {
  try {
    console.log("Request received")
    const body = await request.json();
    // Expected parameters: carName, year, issues, location, (optionally budget and preferredBrands)
    const { carName, year, issues, location, budget, preferredBrands, recycledParts, retailParts} = body;
    
    if (!carName || !year || !issues || !location) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log(body)  
    
    const result = await runSearchWorkflow({
      carName,
      year,
      issues,
      location,
      budget,
      preferredBrands,
      recycledParts,
      retailParts,
    });
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in search workflow:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 