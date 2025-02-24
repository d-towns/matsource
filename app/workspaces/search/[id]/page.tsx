import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/parts-columns"
import { z } from 'zod'

// Define the schema for type safety
const RecycledResponseSchema = z.object({
  identifiedParts: z.array(z.string()),
  storeResults: z.array(
    z.object({
      store: z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string().optional(),
        location: z.string(),
        url: z.string().optional(),
      }),
      availableParts: z.array(
        z.object({
          part: z.string(),
          year: z.string(),
          model: z.string(),
          grade: z.string(),
          stockNumber: z.string(),
          price: z.string(),
          distance: z.string(),
          deliveryTime: z.string(),
          inStock: z.boolean(),
          url: z.string(),
        })
      ),
    })
  ),
});


async function getSearchResults(searchId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('search_results')
    .select(`
      *,
      searches(*)
    `)
    .eq('search_id', searchId)
    .single();

  if (error || !data) {
    return null;
  }

  try {
    console.log(data)
    const result = RecycledResponseSchema.parse(data.result_data);
    return {
      ...result,
      year: data.searches.year,
      make: data.searches.make,
      model: data.searches.model,
    };
  } catch (err) {
    console.error('Invalid result data format:', err);
    return null;
  }
}

export default async function SearchResultPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const results = await getSearchResults(id);

  if (!results) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Search Results for {results.year} {results.make} {results.model}</h1>
    

      <div className="space-y-6">
        <DataTable 
          columns={columns} 
          data={results.storeResults.flatMap(result => 
            result.availableParts.map(part => ({
              ...part,
              store: result.store
            }))
          )} 
        />
      </div>
    </div>
  );
} 