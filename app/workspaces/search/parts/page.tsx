import SearchForm from "@/components/SearchForm"
import { SearchHistory } from "@/components/SearchHistory"
import { SearchProvider } from "@/contexts/search-context"

export default function SearchPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Parts</h1>
        <p className="text-muted-foreground">
          Search for parts by entering your vehicle details and requirements
        </p>
      </div>
      <SearchProvider>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          <SearchForm />
          <SearchHistory />
        </div>
      </SearchProvider>
    </div>
  )
}
