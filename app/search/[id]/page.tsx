import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

type SearchResults = z.infer<typeof RecycledResponseSchema>;

async function getSearchResults(searchId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('search_results')
    .select('result_data')
    .eq('search_id', searchId)
    .single();

  if (error || !data) {
    return null;
  }

  try {
    return RecycledResponseSchema.parse(data.result_data);
  } catch (err) {
    console.error('Invalid result data format:', err);
    return null;
  }
}

export default async function SearchResultPage({
  params
}: {
  params: { id: string }
}) {
  const results = await getSearchResults(params.id);

  if (!results) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Identified Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.identifiedParts.map((part, index) => (
                <Badge key={index} variant="secondary">
                  {part}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {results.storeResults.map((storeResult, storeIndex) => (
          <Card key={storeIndex}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{storeResult.store.name}</span>
                <Badge variant="outline">{storeResult.store.location}</Badge>
              </CardTitle>
              {storeResult.store.phone && (
                <p className="text-sm text-muted-foreground">
                  📞 {storeResult.store.phone}
                </p>
              )}
              {storeResult.store.url && (
                <a 
                  href={storeResult.store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Visit Store Website
                </a>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storeResult.availableParts.map((part, partIndex) => (
                  <div key={partIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{part.part}</h3>
                      <Badge variant={part.inStock ? "secondary" : "destructive"}>
                        {part.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Year:</span> {part.year}</p>
                        <p><span className="font-medium">Model:</span> {part.model}</p>
                        <p><span className="font-medium">Grade:</span> {part.grade}</p>
                        <p><span className="font-medium">Stock #:</span> {part.stockNumber}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Price:</span> {part.price}</p>
                        <p><span className="font-medium">Distance:</span> {part.distance}</p>
                        <p><span className="font-medium">Delivery:</span> {part.deliveryTime}</p>
                        <a 
                          href={part.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Part Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 