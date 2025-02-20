"use client"

import { useSearch } from '@/contexts/search-context'
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'

export function SearchHistory() {
  const { searchHistory, updateSearchHistory, isLoading  } = useSearch();

  useEffect(() => {
    const eventSource = new EventSource('/api/search/events');

    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        console.log("SSE Update received:", update);
        // Only update search step and status.
        if (update.searchId && update.status && update.step) {
          updateSearchHistory(update.searchId, { status: update.status, step: update.step });
        }
      } catch (err) {
        console.error("Error parsing SSE event data:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [updateSearchHistory]);

  return (
    <div className="h-full w-full sm:w-[600px] md:w-[700px] lg:w-[800px] xl:w-full mx-auto">
      <div className="p-4 border rounded bg-background lg:sticky lg:top-4">
        <h3 className="text-lg font-semibold mb-4">Search History</h3>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          searchHistory.length === 0 ? (
            <p className="text-gray-500">No searches found</p>
          ) : (
          <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {searchHistory.map((search) => (
              <Card key={search.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{search.car_name}</h4>
                    <p className="text-sm text-gray-500">{search.year}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(search.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{search.issues}</p>
                <div className="text-xs text-gray-500">
                  <p>Location: {search.location}</p>
                  {search.preferred_brands?.length > 0 && (
                    <p>Brands: {search.preferred_brands.join(', ')}</p>
                  )}
                  <div className="flex gap-2 mt-1">
                    {search.recycled_parts && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Recycled
                      </span>
                    )}
                    {search.retail_parts && (
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Retail
                      </span>
                    )}
                  </div>
                  {search.status && (
                    <p className="mt-2">Status: {search.status}</p>
                  )}
                  {search.step && (
                    <p className="text-xs text-gray-400">Step: {search.step}</p>
                  )}
                </div>
              </Card>
            ))}
            </div>
          )
        )}
      </div>
    </div>
  )
} 