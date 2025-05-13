"use client"

import { useSearch } from '@/context/search-context'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Spinner } from './ui/spinner'

export function SearchHistory() {
  const { 
    searchHistory, 
    isLoading, 
    currentPage, 
    totalPages, 
    setCurrentPage 
  } = useSearch();
  const router = useRouter();

  // useEffect(() => {
  //   const response = await fetch('/api/search/events');
  //   const reader = response.body
  //     .pipeThrough(new TextDecoderStream())
  //   .getReader();
  // }, [updateSearchHistory]);

  return (
    <div className="h-full w-full sm:w-[600px] md:w-[700px] lg:w-[800px] xl:w-full mx-auto">
              <h3 className="text-lg font-semibold mb-4">Search History</h3>
      <div className="p-4 border rounded bg-background lg:sticky lg:top-4">

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : searchHistory.length === 0 ? (
          <p className="text-gray-500">No searches found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {searchHistory.map((search) => (
                <Card key={search.id} className="p-4">
                        <span className="text-xs text-gray-400">
                      {new Date(search.created_at).toLocaleDateString()}
                    </span>
                  <div className='flex flex-row gap-9'>
                    <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium"> {search.year} {search.make} {search.model} </h4>
                    </div>

                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{search.issues}</p>
                  <div className="text-xs text-gray-500">
                    <p>Location: {search.location}</p>
                    {search.preferred_brands?.length > 0 && (
                      <p>Brands: {search.preferred_brands.join(', ')}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      {search.part_search_type && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {search.part_search_type}
                        </span>
                      )}
                      {search.distance && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          {search.distance}
                        </span>
                      )}
                    </div>
                  </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                  {search.status && (
                      <Badge variant="outline" className='w-fit'>{search.status.toUpperCase()}</Badge>
                    )}
                    {search.step  && (
                      <div className="flex items-center gap-2">
                        <Label className="text-lg text-gray-400">{search.step}</Label>
                        {search.status !== 'completed' && <Spinner size="sm" className="text-blue-500" />}
                      </div>
                    )}
                    {search.status === 'completed' && (
                      <div className="mt-4">
                        <Button 
                          variant="outline"

                          onClick={() => router.push(`/workspaces/search/${search.id}`)}
                        >
                          View Results
                        </Button>
                      </div>
                    )}
                    </div>
                    </div>
                </Card>
              ))}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  )
} 